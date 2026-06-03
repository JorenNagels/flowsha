'use client';

import { useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function DragScroll({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    state.current.down = true;
    state.current.moved = false;
    state.current.startX = e.clientX;
    state.current.scrollLeft = el.scrollLeft;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!state.current.down) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.clientX - state.current.startX;
    if (!state.current.moved && Math.abs(dx) > 5) {
      state.current.moved = true;
      el.setPointerCapture(e.pointerId);
    }
    if (state.current.moved) el.scrollLeft = state.current.scrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    state.current.down = false;
    const el = ref.current;
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  };

  const scrollNext = () => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className={`${className} cursor-grab select-none active:cursor-grabbing`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Scroll right"
        className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/70 bg-forest/70 text-xl text-cream backdrop-blur-sm transition hover:bg-forest md:flex"
      >
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
