import { useEffect, useRef, useState } from "react";

const minHeight = 112;

/**
 * One variant of an example in a sandboxed iframe. `allow-scripts` without `allow-same-origin`
 * gives the fragment an opaque origin: it cannot read or change this page, and its markup never
 * joins this page's accessibility tree. The frame grows to the height the demo reports.
 * Examples with motion load only after "Uruchom przykład", so this page still meets 2.2.2.
 */
export function ExampleFrame({
  src,
  title,
  variant,
  motion,
}: {
  src: string;
  title: string;
  variant: "bad" | "good";
  motion: boolean;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);
  const [started, setStarted] = useState(!motion);

  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.source !== frame.current?.contentWindow) return;
      const { data } = event;
      if (typeof data === "object" && data !== null && "a11yExampleHeight" in data && typeof data.a11yExampleHeight === "number") {
        setHeight(Math.max(minHeight, Math.ceil(data.a11yExampleHeight)));
      }
    };
    window.addEventListener("message", onMessage);
    // The frame may have loaded, and reported, before this page became interactive.
    frame.current?.contentWindow?.postMessage("a11y-example-measure", "*");
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [started]);

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

  return (
    <iframe
      ref={frame}
      src={src}
      title={title}
      sandbox="allow-scripts"
      data-variant={variant}
      style={{ height }}
      className="block w-full rounded-xs border-2 border-control bg-paper-2"
    />
  );
}
