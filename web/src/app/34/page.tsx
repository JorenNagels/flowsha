import type { Metadata } from 'next';
import { TRIAL_META } from '../_chrome-trials/registry';
import { Art34 } from '../_chrome-trials/artdirections';

// Internal trial — see src/app/_chrome-trials/artdirections.tsx.
const trial = TRIAL_META.find((t) => t.id === '34')!;

export const metadata: Metadata = {
  title: `Trial 34 — ${trial.name} (internal)`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Art34 />;
}
