import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExampleFrame } from "~/components/example-frame";
import { DraftBadge } from "~/components/level-badge";
import { TermTips } from "~/components/term-tips";
import { getExample } from "~/content/content.functions";
import { variantLabels } from "~/content/demo-document";

export const Route = createFileRoute("/praktyka/$slug")({
  loader: async ({ params }) => {
    const found = await getExample({ data: params.slug });
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.example.title} · Praktyka · a11y playground` : "a11y playground" }],
  }),
  component: ExamplePage,
});

const panes = [
  { variant: "bad", heading: "Zepsute", glyph: "✕", tone: "text-bad" },
  { variant: "good", heading: "Poprawne", glyph: "✓", tone: "text-good" },
] as const;

/** One example: the broken and the fixed variant side by side, with code and screen reader notes. */
function ExamplePage() {
  const { example, terms } = Route.useLoaderData();

  return (
    <article>
      <nav aria-label="Okruszki" className="pt-4 font-mono text-[0.8125rem] text-ink-2">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link to="/praktyka" className="inline-flex min-h-11 items-center underline underline-offset-3">
              Praktyka
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">{example.title}</span>
          </li>
        </ol>
      </nav>

      <header className="pt-3 pb-2">
        <h1 className="text-[clamp(1.5rem,4vw,2rem)] leading-tight font-bold tracking-tight">{example.title}</h1>
        <TermTips terms={terms}>
          <div className="prose mt-3" dangerouslySetInnerHTML={{ __html: example.introHtml }} />
        </TermTips>
        <ul aria-label="Kryteria WCAG" className="mt-4 flex flex-wrap items-center gap-2">
          {example.criteria.map((id) => (
            <li key={id}>
              <Link
                to="/kryteria/$criterionId"
                params={{ criterionId: id }}
                className="inline-flex min-h-11 items-center rounded border border-control bg-surface px-3 font-mono text-sm font-semibold hover:border-ink"
              >
                {id}
              </Link>
            </li>
          ))}
          {example.status === "szkic" ? (
            <li>
              <DraftBadge />
            </li>
          ) : null}
        </ul>
      </header>

      <div className="mt-6 grid gap-px overflow-hidden rounded border border-rule bg-rule lg:grid-cols-2">
        {panes.map(({ variant, heading, glyph, tone }) => {
          const data = example[variant];
          return (
            <section key={variant} aria-labelledby={`${variant}-title`} className="min-w-0 bg-surface px-5 pt-4 pb-6">
              <h2 id={`${variant}-title`} className={`font-mono text-[0.8125rem] font-bold tracking-wider uppercase ${tone}`}>
                <span aria-hidden="true">{glyph} </span>
                {heading}
              </h2>
              <p className="mt-2 mb-4 text-[0.9375rem] text-ink-2">{data.why}</p>
              <ExampleFrame
                src={`/demo/${example.slug}/${variant}`}
                title={`Przykład ${variantLabels[variant]}: ${example.title}`}
                variant={variant}
                motion={example.motion}
              />
              <details className="disclosure mt-4 rounded border border-control">
                <summary className="flex min-h-11 cursor-pointer items-center px-3.5 font-semibold">Kod</summary>
                <pre className="overflow-x-auto rounded-b bg-[#101314] px-4 py-3 text-[#e8e6e1]">
                  <code className="font-mono text-[0.8125rem] leading-relaxed">{data.source}</code>
                </pre>
              </details>
              <div className="mt-4 border-t border-rule pt-3">
                <h3 className="font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">Czytnik ekranu powie</h3>
                <p className="mt-1 text-[0.9375rem]">{data.announces}</p>
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
