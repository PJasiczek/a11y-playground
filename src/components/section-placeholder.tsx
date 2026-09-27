/**
 * Stand-in for a top-level section whose content lands in a later phase.
 * Keeps navigation, focus handling and axe checks testable from day one.
 */
export function SectionPlaceholder({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="py-10">
      <h1 className="text-[1.875rem] font-bold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-[60ch] text-ink-2">{lead}</p>
      <p className="mt-6 font-mono text-sm text-ink-2">Ta sekcja jest w przygotowaniu.</p>
    </div>
  );
}
