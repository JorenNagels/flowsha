import type { Metadata } from 'next';
import { TRIAL_META } from '../_chrome-trials/registry';
import ArchiveTrial from '../_chrome-trials/archive';

// Internal trial — see src/app/_chrome-trials/archive.tsx.
const trial = TRIAL_META.find((t) => t.id === '24')!;

export const metadata: Metadata = {
  title: `Trial 24 — ${trial.name} (internal)`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ArchiveTrial id="24" />;
}
