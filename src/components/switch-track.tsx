/**
 * The track and knob drawn inside a switch-like toggle button (Spokój, Tryb ciemny). Decorative:
 * the button's name and aria-pressed carry the state. The knob slides only after the reader has
 * pressed the button in this visit (`moved`), so a stored theme applied on load never animates.
 */
export function SwitchTrack({ on, moved }: { on: boolean; moved: boolean }) {
  return (
    <span aria-hidden="true" className="relative h-5 w-9 rounded-full border-2 border-current">
      <span
        className={`absolute top-0.5 left-0.5 size-3 rounded-full bg-current ${on ? "translate-x-4" : ""} ${moved ? "transition-transform duration-150 ease-(--ease-out)" : ""}`}
      />
    </span>
  );
}
