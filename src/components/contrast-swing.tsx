import { useId, useState } from "react";

/**
 * Three greys on white, measured: what helper text looks like at each ratio and which criterion
 * it meets. The ratios are real (the greys are #b5b5b5, #767676 and #595959 on #ffffff).
 */
const steps = [
  { value: "2", label: "2:1", grey: "#b5b5b5", verdict: "Za słabo. Nie spełnia 1.4.3.", meets: false },
  { value: "4.5", label: "4,5:1", grey: "#767676", verdict: "Spełnia 1.4.3, poziom AA.", meets: true },
  { value: "7", label: "7:1", grey: "#595959", verdict: "Spełnia też 1.4.6, poziom AAA.", meets: true },
] as const;

type Step = (typeof steps)[number];

/**
 * The toy on the home page, drawn as the password field of the home page graphic: pick a contrast
 * ratio and watch the hint under the field fade in or out. The field is a picture, hidden from
 * assistive technology (its hint is low contrast on purpose); the radio group and the verdict,
 * announced politely, carry the same information as text.
 */
export function ContrastSwing() {
  const [current, setCurrent] = useState<Step>(steps[1]);
  const name = useId();

  return (
    <div>
      {/* Low contrast on purpose, like the broken half of an example: hidden and inert, the text below says it. Fixed colours: it is a picture of a light form. */}
      <div aria-hidden="true" inert className="rounded-lg border border-[#e4dfd6] bg-white p-4 text-[#1f1b2e]">
        <p className="text-sm font-extrabold">Hasło musi mieć 8 znaków</p>
        <p className="mt-2 flex h-11 items-center rounded-full border-2 border-[#d9d3e3] px-4">
          <span className="text-lg tracking-[0.25em]">••••••••</span>
          <svg viewBox="0 0 20 20" className="ml-auto size-5.5">
            <circle cx="10" cy="10" r="9" fill="#1f8a4c" />
            <path d="m6 10.3 2.7 2.7L14 7.6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
        <p
          className="mt-2.5 flex items-center gap-1.5 text-sm font-bold transition-colors duration-300 ease-(--ease-out)"
          style={{ color: current.grey }}
        >
          <span>✓</span>
          Sugestia: użyj zdania zamiast jednego słowa.
        </p>
      </div>
      <fieldset className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-rule px-4 py-2.5">
        <legend className="sr-only">Kontrast tekstu</legend>
        <span aria-hidden="true" className="mr-auto flex items-center gap-2 font-extrabold">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5 fill-none stroke-current stroke-2">
            <circle cx="10" cy="10" r="7" />
            <path d="M10 3v14a7 7 0 0 0 0-14z" className="fill-current" />
          </svg>
          Kontrast tekstu
        </span>
        <div className="flex flex-wrap gap-1.5">
          {steps.map((step) => (
            <label key={step.value} className="relative">
              <input
                type="radio"
                name={name}
                value={step.value}
                checked={current.value === step.value}
                onChange={() => {
                  setCurrent(step);
                }}
                className="peer absolute inset-0 opacity-0"
              />
              <span className="inline-flex min-h-11 min-w-14 cursor-pointer items-center justify-center gap-1.5 rounded-full border-2 border-control bg-surface px-3.5 font-semibold peer-checked:border-good peer-checked:bg-good peer-checked:text-surface peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
                {step.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <p aria-live="polite" className="contrast-verdict sr-only">
        <span aria-hidden="true" className={`grid size-6 place-items-center rounded-full text-sm text-surface ${current.meets ? "bg-good" : "bg-bad"}`}>
          {current.meets ? "✓" : "✕"}
        </span>
        {current.verdict}
      </p>
    </div>
  );
}
