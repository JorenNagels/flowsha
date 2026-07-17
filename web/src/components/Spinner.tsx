// A spinning ring — a little nod to a spinning hoop. Used for loading states.
export function Spinner({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-[3px] border-cream/15 border-t-mustard ${className}`}
    />
  );
}

// Centred spinner + label, for use inside a content area.
export function LoadingBlock({
  label = 'Loading…',
  className = 'py-20',
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 text-cream/60 ${className}`}>
      <Spinner />
      <p className="text-sm">{label}</p>
    </div>
  );
}
