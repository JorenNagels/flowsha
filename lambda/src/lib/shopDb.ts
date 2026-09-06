import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { Order, OrderStatus, ReadyMadeHoop } from '@flowsha/shared';

// Set by CDK. Unset (local dev, no AWS creds) makes reads return [] and writes
// log-and-skip, mirroring the pattern in db.ts.
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE_NAME || '';
const ORDERS_TABLE = process.env.ORDERS_TABLE_NAME || '';

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

export function isShopConfigured(): boolean {
  return Boolean(PRODUCTS_TABLE && ORDERS_TABLE);
}

// --- Local dev store ---------------------------------------------------------
//
// With no table configured (`npm run dev -w lambda`, no AWS credentials) the shop
// reads and writes this in-memory array instead. It exists so the ready-made grid,
// the cart and the products dashboard can be exercised locally without standing up
// DynamoDB — the three seeds deliberately cover every badge state, including a
// reservation that has already expired and so must still be buyable.
//
// Never reachable in production: every function below checks the table name first.
const devProducts: ReadyMadeHoop[] = [
  {
    id: 'dev-sunset',
    createdAt: '2026-08-01T10:00:00.000Z',
    title: 'Sunset spiral',
    description: 'Copper over black, wound tight. Catches the light beautifully at dusk.',
    sizeInches: 34,
    tubingId: 'regular',
    jointId: 'collapsible',
    tapeSummary: 'Copper shiny over black gaffer',
    pricePence: 4500,
    status: 'available',
    photos: [],
  },
  {
    id: 'dev-seafoam',
    createdAt: '2026-08-05T10:00:00.000Z',
    title: 'Seafoam',
    description: 'Teal shiny end to end, with a clear grip inside edge.',
    sizeInches: 30,
    tubingId: 'skinny',
    jointId: 'fixed',
    tapeSummary: 'Teal shiny, clear grip',
    pricePence: 5200,
    // Hold expired months ago — must still be buyable, since TTL sweeps lag.
    status: 'reserved',
    reservedUntil: '2026-08-06T10:00:00.000Z',
    reservedBy: 'dev-stale-session',
    photos: [],
  },
  {
    id: 'dev-magenta',
    createdAt: '2026-08-09T10:00:00.000Z',
    title: 'Magenta dawn',
    sizeInches: 28,
    tubingId: 'skinny',
    jointId: 'fixed',
    tapeSummary: 'Magenta shiny over white gaffer',
    pricePence: 4000,
    status: 'sold',
    photos: [],
  },
];

async function scanAll<T>(tableName: string): Promise<T[]> {
  const items: T[] = [];
  let ExclusiveStartKey: Record<string, unknown> | undefined;
  do {
    const res = await docClient.send(new ScanCommand({ TableName: tableName, ExclusiveStartKey }));
    if (res.Items) items.push(...(res.Items as T[]));
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

// --- Products (ready-made hoops) ---------------------------------------------

export async function listProducts(): Promise<ReadyMadeHoop[]> {
  if (!PRODUCTS_TABLE) return [...devProducts];
  const items = await scanAll<ReadyMadeHoop>(PRODUCTS_TABLE);
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/** What the public /shop/ready-made/ page sees: no drafts, no archived hoops. */
export async function listPublicProducts(): Promise<ReadyMadeHoop[]> {
  const all = await listProducts();
  return all.filter((p) => p.status !== 'draft' && p.status !== 'archived');
}

export async function getProduct(id: string): Promise<ReadyMadeHoop | undefined> {
  if (!PRODUCTS_TABLE) return devProducts.find((p) => p.id === id);
  const res = await docClient.send(new GetCommand({ TableName: PRODUCTS_TABLE, Key: { id } }));
  return res.Item as ReadyMadeHoop | undefined;
}

export async function putProduct(hoop: ReadyMadeHoop): Promise<void> {
  if (!PRODUCTS_TABLE) {
    const i = devProducts.findIndex((p) => p.id === hoop.id);
    if (i >= 0) devProducts[i] = hoop;
    else devProducts.push(hoop);
    return;
  }
  await docClient.send(new PutCommand({ TableName: PRODUCTS_TABLE, Item: hoop }));
}

/**
 * Soft delete. A hard delete would orphan any order that references this hoop,
 * so archived hoops stay in the table and simply drop out of the public list.
 */
export async function archiveProduct(id: string): Promise<void> {
  if (!PRODUCTS_TABLE) {
    const hoop = devProducts.find((p) => p.id === id);
    if (hoop) hoop.status = 'archived';
    return;
  }
  await docClient.send(
    new UpdateCommand({
      TableName: PRODUCTS_TABLE,
      Key: { id },
      UpdateExpression: 'SET #s = :archived',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':archived': 'archived' },
    }),
  );
}

// --- Orders ------------------------------------------------------------------

export async function listOrders(): Promise<Order[]> {
  if (!ORDERS_TABLE) return [];
  const items = await scanAll<Order>(ORDERS_TABLE);
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getOrder(id: string): Promise<Order | undefined> {
  if (!ORDERS_TABLE) return undefined;
  const res = await docClient.send(new GetCommand({ TableName: ORDERS_TABLE, Key: { id } }));
  return res.Item as Order | undefined;
}

/** Thrown when a ready-made hoop was taken by someone else mid-checkout. */
export class HoopUnavailableError extends Error {
  constructor() {
    super('Sorry — one of those hoops has just been taken. Please review your basket.');
    this.name = 'HoopUnavailableError';
  }
}

/**
 * Reserve every ready-made hoop in the order AND write the pending order, as ONE
 * transaction. Either the whole thing lands or none of it does, so two concurrent
 * checkouts for the same one-off hoop can never both succeed.
 *
 * The reservation condition treats an EXPIRED hold as available. DynamoDB TTL
 * deletion can lag by up to 48 hours, so correctness must not depend on a sweeper
 * having run — the condition does the work instead.
 */
export async function reserveAndCreateOrder(
  order: Order,
  reservationMinutes: number,
): Promise<void> {
  if (!isShopConfigured()) {
    console.log('[dev] order (no tables configured):', JSON.stringify(order));
    return;
  }

  const now = new Date().toISOString();
  const until = new Date(Date.now() + reservationMinutes * 60_000).toISOString();

  const reservations = order.reservedHoopIds.map((id) => ({
    Update: {
      TableName: PRODUCTS_TABLE,
      Key: { id },
      UpdateExpression: 'SET #s = :reserved, reservedUntil = :until, reservedBy = :session',
      ConditionExpression:
        '#s = :available OR (#s = :reserved AND (attribute_not_exists(reservedUntil) OR reservedUntil < :now))',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: {
        ':reserved': 'reserved',
        ':available': 'available',
        ':until': until,
        ':session': order.id,
        ':now': now,
      },
    },
  }));

  try {
    await docClient.send(
      new TransactWriteCommand({
        TransactItems: [
          ...reservations,
          {
            Put: {
              TableName: ORDERS_TABLE,
              Item: order,
              ConditionExpression: 'attribute_not_exists(id)',
            },
          },
        ],
      }),
    );
  } catch (err) {
    if ((err as { name?: string }).name === 'TransactionCanceledException') {
      throw new HoopUnavailableError();
    }
    throw err;
  }
}

/**
 * Webhook: payment succeeded. Flips the order to paid and every held hoop to sold,
 * atomically.
 *
 * Idempotent by construction — the order update is conditional on it still being
 * `pending`, so a replayed Stripe event cancels the transaction and changes
 * nothing. Returns false when the event had already been processed.
 */
export async function markOrderPaid(
  sessionId: string,
  details: {
    customerName?: string;
    customerEmail?: string;
    shippingAddress?: string;
    reservedHoopIds: string[];
  },
): Promise<boolean> {
  if (!isShopConfigured()) return false;

  const now = new Date().toISOString();

  const sales = details.reservedHoopIds.map((id) => ({
    Update: {
      TableName: PRODUCTS_TABLE,
      Key: { id },
      UpdateExpression: 'SET #s = :sold REMOVE reservedUntil, reservedBy',
      // Only the session holding the hoop may sell it.
      ConditionExpression: 'reservedBy = :session',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':sold': 'sold', ':session': sessionId },
    },
  }));

  try {
    await docClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Update: {
              TableName: ORDERS_TABLE,
              Key: { id: sessionId },
              UpdateExpression:
                'SET #s = :paid, paidAt = :now, customerName = :name, customerEmail = :email, shippingAddress = :addr',
              ConditionExpression: 'attribute_exists(id) AND #s = :pending',
              ExpressionAttributeNames: { '#s': 'status' },
              ExpressionAttributeValues: {
                ':paid': 'paid',
                ':pending': 'pending',
                ':now': now,
                ':name': details.customerName ?? '',
                ':email': details.customerEmail ?? '',
                ':addr': details.shippingAddress ?? '',
              },
            },
          },
          ...sales,
        ],
      }),
    );
    return true;
  } catch (err) {
    if ((err as { name?: string }).name === 'TransactionCanceledException') {
      // Already paid (Stripe replay) or the hold moved on. Not an error.
      console.log(`markOrderPaid: no-op for ${sessionId} (already processed).`);
      return false;
    }
    throw err;
  }
}

/**
 * Webhook: the Checkout Session expired without payment. Put the hoops back and
 * cancel the pending order. Best-effort and per-item: a hoop whose hold has
 * already moved to another session must not be clawed back, hence the condition.
 */
export async function releaseReservation(sessionId: string, hoopIds: string[]): Promise<void> {
  if (!isShopConfigured()) return;

  for (const id of hoopIds) {
    try {
      await docClient.send(
        new UpdateCommand({
          TableName: PRODUCTS_TABLE,
          Key: { id },
          UpdateExpression: 'SET #s = :available REMOVE reservedUntil, reservedBy',
          ConditionExpression: 'reservedBy = :session AND #s = :reserved',
          ExpressionAttributeNames: { '#s': 'status' },
          ExpressionAttributeValues: {
            ':available': 'available',
            ':reserved': 'reserved',
            ':session': sessionId,
          },
        }),
      );
    } catch (err) {
      if ((err as { name?: string }).name !== 'ConditionalCheckFailedException') throw err;
    }
  }

  try {
    await docClient.send(
      new UpdateCommand({
        TableName: ORDERS_TABLE,
        Key: { id: sessionId },
        UpdateExpression: 'SET #s = :cancelled',
        ConditionExpression: 'attribute_exists(id) AND #s = :pending',
        ExpressionAttributeNames: { '#s': 'status' },
        ExpressionAttributeValues: { ':cancelled': 'cancelled', ':pending': 'pending' },
      }),
    );
  } catch (err) {
    if ((err as { name?: string }).name !== 'ConditionalCheckFailedException') throw err;
  }
}

/** Record the Stripe session id once it exists, for the dashboard's payment link. */
export async function setOrderSession(id: string, stripeSessionId: string): Promise<void> {
  if (!ORDERS_TABLE) return;
  await docClient.send(
    new UpdateCommand({
      TableName: ORDERS_TABLE,
      Key: { id },
      UpdateExpression: 'SET stripeSessionId = :sid',
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeValues: { ':sid': stripeSessionId },
    }),
  );
}

/** Dashboard: move an order along (paid → in progress → dispatched). */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingNumber?: string,
): Promise<void> {
  if (!ORDERS_TABLE) return;

  const values: Record<string, unknown> = { ':status': status };
  let expr = 'SET #s = :status';

  if (trackingNumber !== undefined) {
    expr += ', trackingNumber = :tracking';
    values[':tracking'] = trackingNumber;
  }
  if (status === 'dispatched') {
    expr += ', dispatchedAt = :now';
    values[':now'] = new Date().toISOString();
  }

  await docClient.send(
    new UpdateCommand({
      TableName: ORDERS_TABLE,
      Key: { id },
      UpdateExpression: expr,
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: values,
    }),
  );
}
