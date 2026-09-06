'use client';

import { useEffect } from 'react';
import { useCart } from '@/components/shop/CartProvider';

// The basket is cleared here rather than before the Stripe redirect: cancelling
// on Stripe's page must bring you back to an intact basket, so the only safe
// place to empty it is once payment has actually gone through.
export default function ClearCartOnSuccess() {
  const { clear, isReady } = useCart();

  useEffect(() => {
    if (isReady) clear();
  }, [isReady, clear]);

  return null;
}
