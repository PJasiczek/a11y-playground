import { type SimulationId, simulationIds, simulations } from "~/content/simulations";

/**
 * The simulator rail on an example page (variant 1C of the simulator mocks): one list of native
 * radios, "Bez symulacji" first, each with a line on what it does. Picking one does not move
 * focus; the page announces the choice. The structure simulations follow under their own label
 * (variant 4A of the landmarks mocks).
 */
export function SimulationPicker({
  value,
  onChange,
}: {
  value: SimulationId | undefined;
  onChange: (next: SimulationId | undefined) => void;
}) {
  const options = [
    { id: undefined, label: "Bez symulacji", hint: "Tak, jak widzisz ty." },
    ...simulationIds.map((id) => ({ id, label: simulations[id].label, hint: simulations[id].hint })),
  ];
  const firstStructure = simulationIds.find((id) => simulations[id].kind === "struktura");

  return (
    <fieldset>
      <legend className="mb-2 font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">Symulacja</legend>
      <ul className="border-t-2 border-ink">
        {options.map(({ id, label, hint }) => (
          <li key={id ?? "brak"} className="border-b border-rule">
            {id === firstStructure ? (
              <span className="block border-b border-rule pt-4 pb-1 font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">
                Struktura strony
              </span>
            ) : null}
            <label className="grid min-h-11 cursor-pointer grid-cols-[1.25rem_1fr] gap-x-3 py-2.5 has-checked:font-bold has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent">
              <input
                type="radio"
                name="symulacja"
                checked={value === id}
                onChange={() => {
                  onChange(id);
                }}
                className="mt-0.5 size-5 accent-ink focus-visible:outline-none"
              />
              <span>
                {label}
                <span className="block text-[0.8125rem] font-normal text-ink-2">{hint}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
