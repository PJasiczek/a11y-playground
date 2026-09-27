import { Link } from "@tanstack/react-router";
import { type MouseEvent, type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Term = { term: string; html: string };
type Open = { slug: string; button: HTMLButtonElement };

/**
 * Glossary previews for rendered Markdown (variant C of the glossary mocks). The Markdown
 * parser emits, for the first use of each term, a link to /slownik plus a hidden
 * `button.term-tip`. This wrapper reveals those buttons once the page is interactive, so
 * without JavaScript readers just get the links. Clicking a button toggles a bubble with the
 * short definition in a live region that exists from the start (a toggletip), so screen
 * readers announce it. Esc, the close button or a click elsewhere closes it; focus stays on
 * or returns to the button. The bubble opens below the term and flips above it near the
 * bottom of the viewport, so it never covers the focused button (2.4.11).
 */
export function TermTips({ terms, children }: { terms: Record<string, Term>; children: ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Open | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    for (const button of wrapper.current?.querySelectorAll<HTMLButtonElement>("button.term-tip") ?? []) {
      button.hidden = false;
    }
  }, []);

  useEffect(() => {
    for (const button of wrapper.current?.querySelectorAll<HTMLButtonElement>("button.term-tip") ?? []) {
      button.setAttribute("aria-expanded", String(button === open?.button));
    }
  }, [open]);

  const close = useCallback(
    (returnFocus: boolean) => {
      if (returnFocus) open?.button.focus();
      setOpen(null);
    },
    [open],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !bubble.current?.contains(event.target) && event.target !== open.button) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  useLayoutEffect(() => {
    if (!open || !wrapper.current || !bubble.current) {
      setPosition(null);
      return;
    }
    const frame = wrapper.current.getBoundingClientRect();
    const anchor = open.button.getBoundingClientRect();
    const height = bubble.current.offsetHeight;
    const width = bubble.current.offsetWidth;
    const gap = 8;
    const below = anchor.bottom + gap + height <= window.innerHeight;
    setPosition({
      top: (below ? anchor.bottom + gap : anchor.top - gap - height) - frame.top,
      left: Math.max(0, Math.min(anchor.left - frame.left, frame.width - width)),
    });
  }, [open]);

  const onClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>("button.term-tip");
    const slug = button?.dataset.term;
    if (!button || !slug) return;
    setOpen((current) => (current?.button === button ? null : { slug, button }));
  };

  const entry = open ? terms[open.slug] : undefined;
  const shown = open && entry ? { slug: open.slug, ...entry } : null;

  return (
    // Clicks are delegated from buttons inside the rendered Markdown; the buttons themselves
    // are real <button> elements, so keyboard users get them through the normal tab order.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div ref={wrapper} className="relative" onClick={onClick}>
      {children}
      <div role="status" className="absolute z-10" style={{ top: position?.top ?? 0, left: position?.left ?? 0 }}>
        {shown ? (
          <div
            ref={bubble}
            className="w-[min(26rem,80vw)] rounded border-2 border-ink bg-surface py-3 pr-12 pl-4 text-[0.9375rem] shadow-lg"
            style={{ visibility: position ? "visible" : "hidden" }}
          >
            <button
              type="button"
              onClick={() => {
                close(true);
              }}
              aria-label="Zamknij definicję"
              className="absolute top-1 right-1 inline-flex size-11 items-center justify-center font-mono text-base font-bold"
            >
              ✕
            </button>
            <p className="font-bold">{shown.term}</p>
            <div className="prose-tip" dangerouslySetInnerHTML={{ __html: shown.html }} />
            <p className="mt-2">
              <Link to="/slownik" hash={shown.slug} className="text-accent underline underline-offset-3">
                Całe hasło w słowniku
              </Link>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
