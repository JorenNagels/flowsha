import type { Metadata } from 'next';
import { TRIAL_META } from '../_chrome-trials/registry';
import { Trial8 } from '../_chrome-trials/cinematic';

// Internal trial — see src/app/_chrome-trials/cinematic.tsx. Delete this route (and its
// siblings, and _chrome-trials/) once a direction is chosen.
const trial = TRIAL_META.find((t) => t.id === '8')!;

export const metadata: Metadata = {
  title: `Trial 8 — ${trial.name} (internal)`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Trial8 />;
}
