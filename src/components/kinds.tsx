import type { ReactNode } from "react";

/**
 * The seven kinds of content (DESIGN.md, "The seven kinds"). Each has a name, a home route, an
 * icon and a class that sets its colour pair (--kind, --kind-d in src/styles.css). Navigation,
 * the home page, the footer and the page bands all read this one map, so a kind keeps its colour
 * and icon everywhere (3.2.4).
 */
export const kinds = {
  kryteria: { label: "Kryteria", to: "/kryteria", className: "kind-kryteria" },
  praktyka: { label: "Praktyka", to: "/praktyka", className: "kind-praktyka" },
  sciezki: { label: "Ścieżki", to: "/sciezki", className: "kind-sciezki" },
  prawo: { label: "Prawo", to: "/prawo", className: "kind-prawo" },
  symulatory: { label: "Symulatory", to: "/symulatory", className: "kind-symulatory" },
  slownik: { label: "Słownik", to: "/slownik", className: "kind-slownik" },
  wcag3: { label: "WCAG 3.0", to: "/wcag-3", className: "kind-wcag3" },
} as const;

export type Kind = keyof typeof kinds;

// Route prefixes that belong to a kind beyond its own home route.
const extraPrefixes: Partial<Record<Kind, string[]>> = { prawo: ["/mapowanie"] };

/** The kind a path belongs to, or null for pages outside the seven (home, contact, search). */
export function kindOfPath(pathname: string): Kind | null {
  for (const [kind, { to }] of Object.entries(kinds) as [Kind, (typeof kinds)[Kind]][]) {
    const prefixes = [to, ...(extraPrefixes[kind] ?? [])];
    if (prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return kind;
  }
  return null;
}

// Drawn after the home page graphic (docs/design/2026-10-18-home-graphic): book, cog, route,
// section sign, play button, bookmarked book, shield.
const iconPaths: Record<Kind, ReactNode> = {
  kryteria: <path d="M5 2.5h7l3.5 3.7v11.3H5zM12 2.5v4h3.5M8 9h5M8 12h5M8 15h3" />,
  praktyka: (
    <>
      <circle cx="10" cy="10" r="2.3" />
      <path d="M10 2.8v2M10 15.2v2M2.8 10h2M15.2 10h2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M4.9 15.1l1.4-1.4M13.7 6.3l1.4-1.4" />
      <circle cx="10" cy="10" r="5" />
    </>
  ),
  sciezki: (
    <>
      <circle cx="4.8" cy="4.8" r="1.8" />
      <circle cx="15.2" cy="15.2" r="1.8" />
      <path d="M6.6 4.8h6.1a2.6 2.6 0 0 1 0 5.2H7.3a2.6 2.6 0 0 0 0 5.2h6.1" />
    </>
  ),
  prawo: <path d="M12.5 4.5C11.8 3.6 11 3.2 10 3.2c-1.5 0-2.7 1-2.7 2.3 0 3 6 2.4 6 5.8 0 1-.6 1.8-1.5 2.2M7.5 15.5c.7.9 1.5 1.3 2.5 1.3 1.5 0 2.7-1 2.7-2.3 0-3-6-2.4-6-5.8 0-1 .6-1.8 1.5-2.2" />,
  symulatory: (
    <>
      <circle cx="10" cy="10" r="7.2" />
      <path d="M8.4 7v6l4.8-3z" />
    </>
  ),
  slownik: <path d="M10 5.6C8.4 4.3 6.2 4 3 4.2v10.6c3.2-.2 5.4.1 7 1.4 1.6-1.3 3.8-1.6 7-1.4V4.2c-3.2-.2-5.4.1-7 1.4zM10 5.6v10.6" />,
  wcag3: <path d="M10 2.8 16 5v4.6c0 3.7-2.6 6.4-6 7.6-3.4-1.2-6-3.9-6-7.6V5zM7.4 10l1.8 1.8 3.4-3.6" />,
};

/** The kind's icon, decorative: its name is always written next to it. */
export function KindIcon({ kind, className = "size-5" }: { kind: Kind; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`${className} shrink-0 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]`}
    >
      {iconPaths[kind]}
    </svg>
  );
}

/**
 * The reference logo: four glossy cyan, mint, violet and orange bars. They ring once
 * when the wordmark is hovered (src/styles.css). The same bars draw public/favicon.svg.
 */
export function BrandMark({ className = "h-7" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`xylo-mark brand-bars ${className}`}>
      <span className="brand-bar brand-cyan" />
      <span className="brand-bar brand-mint" />
      <span className="brand-bar brand-violet" />
      <span className="brand-bar brand-orange" />
    </span>
  );
}

/**
 * The bars and the name on two lines, as the header and the footer show it. The two lines are
 * hidden from assistive technology and the name is read once, with its space.
 */
export function Wordmark() {
  return (
    <>
      <BrandMark />
      <span aria-hidden="true" className="flex flex-col leading-[0.95]">
        <span>a11y</span>
        <span>playground</span>
      </span>
      <span className="sr-only">a11y playground</span>
    </>
  );
}
