import type { Metadata } from 'next';
import { TRIAL_META } from '../_chrome-trials/registry';
import { Art39 } from '../_chrome-trials/artdirections';

// Internal trial — see src/app/_chrome-trials/artdirections.tsx.
const trial = TRIAL_META.find((t) => t.id === '39')!;

export const metadata: Metadata = {
  title: `Trial 39 — ${trial.name} (internal)`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Art39 />;
}
