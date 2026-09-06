import type { Metadata } from 'next';
import { TRIAL_META } from '../_chrome-trials/registry';
import { Art45 } from '../_chrome-trials/fullpages-a';

// Internal trial — see src/app/_chrome-trials/fullpages-a.tsx.
const trial = TRIAL_META.find((t) => t.id === '45')!;

export const metadata: Metadata = {
  title: `Trial 45 — ${trial.name} (internal)`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Art45 />;
}
