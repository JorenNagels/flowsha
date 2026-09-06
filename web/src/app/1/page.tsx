import type { Metadata } from 'next';
import ChromeTrial, { trials } from '../_chrome-trials/trials';

// Internal chrome trial — see src/app/_chrome-trials/trials.tsx. Delete this route (and
// its four siblings, and _chrome-trials/) once a direction is chosen.
const trial = trials.find((t) => t.id === '1')!;

export const metadata: Metadata = {
  title: `Chrome trial 1 — ${trial.name} (internal)`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ChromeTrial id="1" />;
}
