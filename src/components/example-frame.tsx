import { type } from "arktype";
import { useState } from "react";
import { type SimulationId, simulations } from "~/content/simulations";
import type { StructureSummary } from "~/content/structure";
import { useDemoFrame } from "./use-demo-frame";

const narrowWidth = 320;

// What the demo posts in keyboard mode, see frameScript in demo-document.ts.
const KeyboardMessage = type({ a11yFocusStep: { n: "number", name: "string", role: "string" } }).or({ a11yBlockedClick: "true" });

// What the demo posts in a structure simulation, see structure.entry.ts.
const StructureMessage = type({
  a11yStructure: {
    landmarks: type({ label: "string", depth: "number" }).array(),
    headings: type({ label: "string", text: "string" }).array(),
    findings: "string[]",
  },
});

type Step = { n: number; name: string; role: string };

/**
 * One variant of an example in a sandboxed iframe. `allow-scripts` without `allow-same-origin`
 * gives the fragment an opaque origin: it cannot read or change this page, and its markup never
 * joins this page's accessibility tree. `allow-forms` lets a form fire its submit event; without
 * it the browser drops the submission before any script sees it. The frame grows to the height the demo reports.
 * Examples with motion load only after "Uruchom przykład", so this page still meets 2.2.2.
 *
 * `simulation` is sent to the frame over postMessage, on every change and every load. What the
 * simulation shows goes under the frame as text: the focus steps and blocked clicks in keyboard
 * mode, the measured verdict at 320 pixels, the landmarks or headings the frame found.
 */
export function ExampleFrame({
  src,
  title,
  variant,
  motion,
  simulation,
}: {
  src: string;
  title: string;
  variant: "bad" | "good";
  motion: boolean;
  simulation: SimulationId | undefined;
}) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [blocked, setBlocked] = useState(0);
  const [structure, setStructure] = useState<StructureSummary | null>(null);
  const [started, setStarted] = useState(!motion);
  const { ref: frame, height, size, send } = useDemoFrame({
    simulation,
    active: started,
    onMessage: (message) => {
      const outline = StructureMessage(message);
      if (!(outline instanceof type.errors)) {
        setStructure(outline.a11yStructure);
        return;
      }
      const data = KeyboardMessage(message);
      if (data instanceof type.errors) return;
      if ("a11yFocusStep" in data) {
        const step = data.a11yFocusStep;
        setSteps((previous) => [...previous, step]);
      } else {
        setBlocked((count) => count + 1);
      }
    },
  });

  // A new simulation starts a new trace. The frame resets its own badges when the message arrives.
  const [traced, setTraced] = useState(simulation);
  if (traced !== simulation) {
    setTraced(simulation);
    setSteps([]);
    setBlocked(0);
    setStructure(null);
  }

  if (!started) {
    return (
      <div className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-xs border-2 border-control bg-paper-2 p-4 text-center">
        <p className="text-[0.9375rem] text-ink-2">Ten przykład się rusza, więc startuje dopiero na żądanie.</p>
        <button
          type="button"
          onClick={() => {
            setStarted(true);
          }}
          className="inline-flex min-h-11 items-center rounded border-2 border-on-marker bg-marker px-4 font-bold text-on-marker"
        >
          Uruchom przykład
        </button>
      </div>
    );
  }

  const label = simulation ? simulations[simulation].label : null;
  const narrow = simulation === "320px";

  return (
    <div>
      {label ? (
        <p className="mb-1 inline-block bg-ink px-2 py-0.5 font-mono text-xs font-semibold text-paper">{label}</p>
      ) : null}
      <div className={narrow ? "overflow-x-auto" : undefined}>
        <iframe
          ref={frame}
          src={src}
          title={label ? `${title}, ${label.toLowerCase()}` : title}
          sandbox="allow-scripts allow-forms"
          data-variant={variant}
          onLoad={send}
          // The 2px borders sit outside the 320 pixels the demo gets.
          style={{ height, width: narrow ? narrowWidth + 4 : undefined }}
          className="block w-full rounded-xs border-2 border-control bg-paper-2"
        />
      </div>

      {simulation === "klawiatura" ? (
        <div className="mt-3 text-[0.9375rem]">
          <h3 className="font-semibold">Kolejność fokusu</h3>
          {steps.length > 0 ? (
            <ol className="mt-1 list-decimal pl-6">
              {steps.map((step) => (
                <li key={step.n}>
                  {step.name} ({step.role})
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-1 text-ink-2">Przejdź do ramki klawiszem Tab. Każdy przystanek pojawi się tutaj.</p>
          )}
          <p className="mt-2 font-mono text-sm">Zablokowane kliknięcia: {blocked}</p>
          <p aria-live="polite" className="sr-only">
            {blocked > 0 ? `Kliknięcie zablokowane, ${String(blocked)}. W tym trybie działa tylko klawiatura.` : ""}
          </p>
        </div>
      ) : null}

      {structure && label && simulation && simulations[simulation].kind === "struktura" ? (
        <StructureList title={label} summary={structure} />
      ) : null}

      {narrow && size ? (
        size.width > size.viewport ? (
          <p className="mt-3 border-l-4 border-bad py-1 pl-3 text-[0.9375rem]">
            <strong className="text-bad">
              <span aria-hidden="true">✕ </span>Nie mieści się.
            </strong>{" "}
            Treść ma {size.width} pikseli szerokości przy {size.viewport} dostępnych, trzeba przewijać w poziomie.
          </p>
        ) : (
          <p className="mt-3 border-l-4 border-good py-1 pl-3 text-[0.9375rem]">
            <strong className="text-good">
              <span aria-hidden="true">✓ </span>Mieści się.
            </strong>{" "}
            Nic nie wychodzi poza {narrowWidth} pikseli.
          </p>
        )
      ) : null}
    </div>
  );
}

/** The scan of one frame as text, under the frame: the same as its outlines, and what is wrong. */
function StructureList({ title, summary }: { title: string; summary: StructureSummary }) {
  const rows = [
    ...summary.landmarks.map(({ label, depth }) => ({ label, depth, text: "" })),
    ...summary.headings.map(({ label, text }) => ({ label, depth: 0, text })),
  ];
  return (
    <div className="mt-3 text-[0.9375rem]">
      <h3 className="font-semibold">{title}</h3>
      {rows.length > 0 ? (
        <ul className="mt-1">
          {rows.map(({ label, depth, text }, index) => (
            <li key={index} style={{ paddingInlineStart: `${String(depth * 1.25)}rem` }}>
              <span className="font-mono text-[0.8125rem] font-semibold">{label}</span>
              {text ? ` ${text}` : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-ink-2">Nic. Czytnik nie ma tu do czego skakać.</p>
      )}
      {summary.findings.length > 0 ? (
        <ul className="mt-2 border-l-4 border-bad py-1 pl-3">
          {summary.findings.map((finding) => (
            <li key={finding}>
              <span aria-hidden="true" className="font-bold text-bad">
                ✕{" "}
              </span>
              {finding}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 border-l-4 border-good py-1 pl-3">
          <strong className="text-good">
            <span aria-hidden="true">✓ </span>Bez uwag.
          </strong>
        </p>
      )}
    </div>
  );
}
