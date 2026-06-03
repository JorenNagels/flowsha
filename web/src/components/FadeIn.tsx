'use client';

import { useEffect, useRef, type ReactNode, type ElementType } from 'react';

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export default function FadeIn({ as, className = '', children }: Props) {
  const Tag = as ?? 'div';
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`fade-up ${className}`}>
      {children}
    </Tag>
  );
}
