import type { Metadata } from 'next';

// Internal-only style explorer: keep it out of search indexes.
export const metadata: Metadata = {
  title: 'Homepage styles (internal)',
  robots: { index: false, follow: false },
};

export default function StylesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
