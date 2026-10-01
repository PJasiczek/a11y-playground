import type { ReactNode } from "react";

/** A labelled row of filter chips, as on /kryteria. */
export function FilterGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="float-left mr-1 font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

/**
 * A native radio or checkbox dressed as a chip. The input stays in the accessibility tree and
 * handles keyboard and state; the checked state shows as a tick and the marker, never colour alone.
 */
export function Chip({
  type,
  name,
  checked,
  onChange,
  children,
}: {
  type: "radio" | "checkbox";
  name?: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center rounded border border-control bg-surface px-3 text-sm font-medium has-checked:border-on-marker has-checked:bg-marker has-checked:font-bold has-checked:text-on-marker has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent">
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      {checked ? (
        <span aria-hidden="true" className="mr-1 font-mono">
          ✓
        </span>
      ) : null}
      {children}
    </label>
  );
}
