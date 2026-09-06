import type { Metadata } from 'next';
import FadeIn from '@/components/FadeIn';
import CartView from '@/components/shop/CartView';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Your Basket',
    description: 'Review your handmade hoop order before checking out.',
    path: '/shop/cart/',
  }),
  // A basket is per-visitor and has nothing to rank for.
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
      <FadeIn as="h1" className="mb-8 font-display text-[clamp(2.5rem,7vw,4rem)]">
        Your basket
      </FadeIn>
      <CartView />
    </section>
  );
}
