import type { Metadata } from 'next';
import { TRIAL_META } from '../_chrome-trials/registry';
import { Art48 } from '../_chrome-trials/fullpages-b';

// Internal trial — see src/app/_chrome-trials/fullpages-b.tsx.
const trial = TRIAL_META.find((t) => t.id === '48')!;

export const metadata: Metadata = {
  title: `Trial 48 — ${trial.name} (internal)`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Art48 />;
}
