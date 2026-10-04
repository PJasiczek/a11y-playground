import { type } from "arktype";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { polishRoles } from "~/content/announce";
import type { Heading, Landmark, StructureView } from "~/content/structure";

const storageKey = "a11y-struktura";
const StoredView = type({ landmarks: "boolean", headings: "boolean" });
const off: StructureView = { landmarks: false, headings: false };

// The switches, kept in sessionStorage so they survive a reload and a move to another page.
// Read once on the client; without storage they last until the page reloads.
let current: StructureView | undefined;
const listeners = new Set<() => void>();

function readView(): StructureView {
  if (current) return current;
  try {
    const stored = StoredView(JSON.parse(sessionStorage.getItem(storageKey) ?? "null"));
    current = stored instanceof type.errors ? off : stored;
  } catch {
    current = off;
  }
  return current;
}

function writeView(next: StructureView) {
  current = next;
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // Storage blocked: the choice lasts until the page reloads.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// The scan with dom-accessibility-api is loaded on the first press, so pages pay nothing for it until then.
const loadTool = () => import("~/content/structure");
type Tool = Awaited<ReturnType<typeof loadTool>>;

/** What the panel lists: the scan of the page as it is on screen. */
type Scan = { landmarks: Landmark[]; headings: { heading: Heading; label: string }[]; findings: string[] };

/**
 * "Struktura strony" (variants 1C and 3A of the landmarks mocks): a button in the bottom right
 * corner of every page opens a panel with two switches. They outline the landmarks and the
 * headings of the page itself, and the panel lists the same as text, with what is wrong with it.
 * Each row moves focus to its element, the way a screen reader jumps with D or H.
 *
 * The outlines follow the page: a mutation outside the panel rescans on the next frame.
 * Render once, in the root layout.
 */
export function StructureTool() {
  // Off on the server and during hydration, so both render the same.
  const view = useSyncExternalStore(subscribe, readView, () => off);
  const [scan, setScan] = useState<Scan | null>(null);
  const tool = useRef<Tool | null>(null);
  const aside = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const on = view.landmarks || view.headings;

  useEffect(() => {
    if (!on) return;

    let cancelled = false;
    let frame = 0;
    const run = (loaded: Tool) => {
      frame = 0;
      // Clear before scanning: the labels are generated content and would end up in names.
      loaded.clearStructure(document);
      const structure = loaded.scanStructure(document.body);
      loaded.markStructure(structure, view, document);
      setScan({
        landmarks: structure.landmarks,
        headings: structure.headings.map((heading) => ({ heading, label: loaded.headingLabel(heading) })),
        findings: loaded.findingsFor(structure.findings, view),
      });
    };
    const observer = new MutationObserver((records) => {
      const loaded = tool.current;
      if (!loaded || frame || records.every((record) => aside.current?.contains(record.target))) return;
      frame = requestAnimationFrame(() => {
        run(loaded);
      });
    });

    void loadTool().then((loaded) => {
      if (cancelled) return;
      tool.current = loaded;
      run(loaded);
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      tool.current?.clearStructure(document);
    };
  }, [view, on]);

  // Closes the panel first, so it never covers the element that takes focus.
  const jump = (element: Element) => {
    if (!(element instanceof HTMLElement)) return;
    panel.current?.hidePopover();
    if (!element.matches("a[href], button, input, select, textarea, summary, [tabindex]")) element.tabIndex = -1;
    element.focus();
  };

  const toggle = (key: keyof StructureView) => {
    writeView({ ...view, [key]: !view[key] });
  };

  return (
    <aside ref={aside} aria-label="Struktura strony" data-a11y-structure-ignore="">
      <button
        type="button"
        popoverTarget="struktura-panel"
        className="fixed right-4 bottom-4 z-40 inline-flex min-h-11 items-center gap-2 rounded border-2 border-ink bg-surface px-3.5 font-semibold shadow-[0_4px_16px_rgb(0_0_0/0.18)] hover:bg-paper-2"
      >
        <span aria-hidden="true" className="font-mono">
          ◫
        </span>
        Struktura strony
        {on ? <span className="font-mono text-[0.8125rem] font-normal text-ink-2">włączona</span> : null}
      </button>

      <div
        ref={panel}
        id="struktura-panel"
        popover="auto"
        aria-labelledby="struktura-title"
        // The UA puts a popover in the middle of the viewport; this one sits above its button.
        style={{ inset: "auto 1rem 4.5rem auto", margin: 0 }}
        className="max-h-[calc(100dvh-6rem)] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto border-2 border-ink bg-surface p-4 text-ink shadow-[0_6px_24px_rgb(0_0_0/0.18)]"
      >
        <h2 id="struktura-title" className="text-lg font-bold tracking-tight">
          Struktura strony
        </h2>
        <p className="mt-1 text-[0.9375rem] text-ink-2">To, między czym czytnik ekranu pozwala skakać po tej stronie.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["landmarks", "Punkty orientacyjne"],
              ["headings", "Nagłówki"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={view[key]}
              onClick={() => {
                toggle(key);
              }}
              className="inline-flex min-h-11 items-center gap-1.5 rounded border border-control bg-surface px-3 text-[0.9375rem] font-semibold hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
            >
              {view[key] ? <span aria-hidden="true">✓</span> : null}
              {label}
            </button>
          ))}
        </div>

        {on && scan ? (
          <>
            {view.landmarks ? (
              <>
                <h3 className="mt-4 font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">Punkty orientacyjne</h3>
                {scan.landmarks.length > 0 ? (
                  <LandmarkTree landmarks={scan.landmarks} onJump={jump} />
                ) : (
                  <p className="mt-1 text-[0.9375rem]">Na tej stronie nie ma żadnego.</p>
                )}
              </>
            ) : null}
            {view.headings ? (
              <>
                <h3 className="mt-4 font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">Nagłówki</h3>
                <ul className="mt-1 border-t border-rule">
                  {scan.headings.map(({ heading, label }, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => {
                          jump(heading.element);
                        }}
                        style={{ paddingInlineStart: `${String(0.25 + (heading.level - 1) * 0.75)}rem` }}
                        className="flex min-h-11 w-full items-baseline gap-2 border-b border-rule py-1.5 pr-1 text-left text-[0.9375rem] hover:bg-paper-2"
                      >
                        <span className={`shrink-0 font-mono text-[0.8125rem] font-semibold ${heading.after ? "text-bad" : "text-ink-2"}`}>
                          {label}
                        </span>
                        <span>{heading.text || "(bez tekstu)"}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {scan.findings.length > 0 ? (
              <div className="mt-4 border-2 border-l-[6px] border-bad px-3 py-2">
                <h3 className="font-bold text-bad">
                  <span aria-hidden="true" className="font-mono">
                    !{" "}
                  </span>
                  Uwagi: {scan.findings.length}
                </h3>
                <ul className="mt-1 list-disc pl-5 text-[0.9375rem]">
                  {scan.findings.map((finding) => (
                    <li key={finding}>{finding}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 border-2 border-l-[6px] border-good px-3 py-2 font-bold text-good">
                <span aria-hidden="true" className="font-mono">
                  ✓{" "}
                </span>
                Bez uwag.
              </p>
            )}
          </>
        ) : (
          <p className="mt-3 text-[0.9375rem]">Włącz jeden z przełączników. Obrysy pojawią się na stronie, a tutaj ich lista.</p>
        )}
      </div>
    </aside>
  );
}

/** Landmarks as nested lists, so a screen reader hears the nesting too. */
function LandmarkTree({ landmarks, onJump, nested = false }: { landmarks: readonly Landmark[]; onJump: (element: Element) => void; nested?: boolean }) {
  return (
    <ul className={nested ? "ml-2 border-l border-rule pl-3" : "mt-1 border-t border-rule"}>
      {landmarks.map((landmark, index) => (
        <li key={index}>
          <button
            type="button"
            onClick={() => {
              onJump(landmark.element);
            }}
            className="flex min-h-11 w-full items-center gap-2 border-b border-rule px-1 py-1.5 text-left text-[0.9375rem] hover:bg-paper-2"
          >
            <span aria-hidden="true" data-a11y-swatch={landmark.role} />
            <span className="shrink-0 font-mono text-[0.8125rem] font-semibold text-ink-2">{polishRoles[landmark.role]}</span>
            <span>{landmark.name}</span>
          </button>
          {landmark.children.length > 0 ? <LandmarkTree landmarks={landmark.children} onJump={onJump} nested /> : null}
        </li>
      ))}
    </ul>
  );
}
