import { type } from "arktype";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { SimulationId } from "~/content/simulations";

const minHeight = 112;

// The size report every demo document posts, see frameScript in demo-document.ts.
const SizeReport = type({ a11yExampleHeight: "number", a11yExampleWidth: "number", a11yExampleViewport: "number" });

/** The demo's content width against the width it has, for the 320-pixel verdict. */
export type FrameSize = { width: number; viewport: number };

/**
 * The plumbing every sandboxed demo frame shares. It takes only messages from its own frame
 * (matched by event.source), grows the frame to the height the demo reports, and sends the
 * simulation on every change. Pass `send` to the iframe's onLoad, so a reloaded frame gets it too.
 * Anything else the demo posts goes to `onMessage` unvalidated; each caller checks its own shapes.
 * `active` is false while a demo with motion waits for "Uruchom przykład" and has no frame yet.
 */
export function useDemoFrame({
  simulation,
  active,
  onMessage,
}: {
  simulation: SimulationId | undefined;
  active: boolean;
  onMessage: (data: unknown) => void;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);
  const [size, setSize] = useState<FrameSize | null>(null);
  const forward = useEffectEvent(onMessage);

  const send = () => {
    ref.current?.contentWindow?.postMessage({ a11ySimulation: simulation ?? null }, "*");
  };

  useEffect(() => {
    const listener = (event: MessageEvent<unknown>) => {
      if (event.source !== ref.current?.contentWindow) return;
      const report = SizeReport(event.data);
      if (report instanceof type.errors) {
        forward(event.data);
        return;
      }
      setHeight(Math.max(minHeight, Math.ceil(report.a11yExampleHeight)));
      setSize({ width: Math.ceil(report.a11yExampleWidth), viewport: Math.ceil(report.a11yExampleViewport) });
    };
    window.addEventListener("message", listener);
    // The frame may have loaded, and reported, before this page became interactive.
    ref.current?.contentWindow?.postMessage("a11y-example-measure", "*");
    return () => {
      window.removeEventListener("message", listener);
    };
  }, [active]);

  useEffect(() => {
    ref.current?.contentWindow?.postMessage({ a11ySimulation: simulation ?? null }, "*");
  }, [simulation, active]);

  return { ref, height, size, send };
}
