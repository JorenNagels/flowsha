import type { Metadata } from 'next';
import { TRIAL_META } from '../_chrome-trials/registry';
import { Art44 } from '../_chrome-trials/fullpages-a';

// Internal trial — see src/app/_chrome-trials/fullpages-a.tsx.
const trial = TRIAL_META.find((t) => t.id === '44')!;

export const metadata: Metadata = {
  title: `Trial 44 — ${trial.name} (internal)`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Art44 />;
}
