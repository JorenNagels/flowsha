import type { Metadata } from 'next';
import { TRIAL_META } from '../_chrome-trials/registry';
import { Trial11 } from '../_chrome-trials/scrollstage';

// Internal trial — see src/app/_chrome-trials/scrollstage.tsx.
const trial = TRIAL_META.find((t) => t.id === '11')!;

export const metadata: Metadata = {
  title: `Trial 11 — ${trial.name} (internal)`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Trial11 />;
}
