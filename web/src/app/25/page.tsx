import type { Metadata } from 'next';
import { TRIAL_META } from '../_chrome-trials/registry';
import MainColourTrial from '../_chrome-trials/maincolour';

// Internal trial — see src/app/_chrome-trials/maincolour.tsx.
const trial = TRIAL_META.find((t) => t.id === '25')!;

export const metadata: Metadata = {
  title: `Trial 25 — ${trial.name} (internal)`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MainColourTrial id="25" />;
}
