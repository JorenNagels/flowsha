import type { Metadata } from 'next';
import { TRIAL_META } from '../_chrome-trials/registry';
import { Trial13 } from '../_chrome-trials/scrollstage';

// Internal trial — see src/app/_chrome-trials/scrollstage.tsx.
const trial = TRIAL_META.find((t) => t.id === '13')!;

export const metadata: Metadata = {
  title: `Trial 13 — ${trial.name} (internal)`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Trial13 />;
}
