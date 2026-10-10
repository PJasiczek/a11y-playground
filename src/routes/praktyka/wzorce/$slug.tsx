import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { type } from "arktype";
import { useState } from "react";
import { ProblemLinks } from "~/components/before-after";
import { DraftBadge } from "~/components/level-badge";
import { AriaTable, Exercise, NativeVerdictBadge, PatternLog } from "~/components/patterns";
import { TermTips } from "~/components/term-tips";
import { useDemoFrame } from "~/components/use-demo-frame";
import { type Announcement, keyNames } from "~/content/announce";
import { patternSections } from "~/content/pattern-labels";
import { getPattern } from "~/content/patterns.functions";
import { pageHead } from "~/lib/seo";
import { breadcrumbLd } from "~/lib/structured-data";

export const Route = createFileRoute("/praktyka/wzorce/$slug")({
  loader: async ({ params }) => {
    const found = await getPattern({ data: params.slug });
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData, match }) =>
    loaderData
      ? pageHead({
          title: `${loaderData.pattern.title} · Wzorce`,
          description: loaderData.pattern.summary,
          path: match.pathname,
          jsonLd: [
            breadcrumbLd([
              { name: "Praktyka", path: "/praktyka" },
              { name: "Wzorce", path: "/praktyka/wzorce" },
              { name: loaderData.pattern.title, path: match.pathname },
            ]),
          ],
        })
      : {},
  component: PatternPage,
});

// What a pattern frame posts besides its size, see pattern-log.ts and frameScript.
const FrameMessage = type({
  a11yAnnounce: {
    kind: "'focus' | 'state' | 'live'",
    text: "string",
    key: type.enumerated(...keyNames, "klik", null),
    "politeness?": "'polite' | 'assertive'",
  },
})
  .or({ a11yState: "(string | null)[]" })
  .or({ a11yBlockedClick: "true" });

const chip = "inline-flex min-h-11 items-center rounded border border-control bg-surface px-3 font-mono text-sm font-semibold hover:border-ink";

/**
 * One pattern (variant 1C of the phase 9 mocks): the working pattern in a sandboxed frame, the
 * exercise under it, and beside it the log of what a screen reader would say and the ARIA table
 * with live values. "Od nowa" reloads the frame, so the pattern starts from its first state.
 */
function PatternPage() {
  const { pattern, terms, examples, beforeAfter } = Route.useLoaderData();
  const [lines, setLines] = useState<Announcement[]>([]);
  const [values, setValues] = useState<{ now: (string | null)[]; changed: boolean[] }>({ now: [], changed: [] });
  const [done, setDone] = useState(0);
  const [keyboardOnly, setKeyboardOnly] = useState(false);
  const [blocked, setBlocked] = useState(0);
  const [run, setRun] = useState(0);

  const { ref, height, send } = useDemoFrame({
    simulation: keyboardOnly ? "klawiatura" : undefined,
    active: true,
    onMessage: (message) => {
      const data = FrameMessage(message);
      if (data instanceof type.errors) return;
      if ("a11yAnnounce" in data) {
        const line = data.a11yAnnounce;
        setLines((previous) => [...previous, line]);
        // Steps go in order: only the current one can be ticked off.
        setDone((current) => {
          const step = pattern.steps[current];
          return step && line.key !== null && line.key !== "klik" && step.keys.includes(line.key) && step.hear === line.text
            ? current + 1
            : current;
        });
      } else if ("a11yState" in data) {
        const now = data.a11yState;
        setValues((previous) => ({
          now,
          changed: previous.now.length === 0 ? now.map(() => false) : now.map((value, index) => value !== previous.now[index]),
        }));
      } else {
        setBlocked((count) => count + 1);
      }
    },
  });

  const restart = () => {
    setLines([]);
    setValues({ now: [], changed: [] });
    setDone(0);
    setBlocked(0);
    setRun((count) => count + 1);
  };

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
            <Link to="/praktyka/wzorce" className="inline-flex min-h-11 items-center underline underline-offset-3">
              Wzorce komponentów
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">{pattern.title}</span>
          </li>
        </ol>
      </nav>

      <header className="pt-3 pb-2">
        <h1 className="text-[clamp(1.5rem,4vw,2rem)] leading-tight font-bold tracking-tight">{pattern.title}</h1>
        <p lang="en" className="mt-1 font-mono text-sm font-semibold text-ink-2">
          {pattern.en}
        </p>
        <p className="mt-3 max-w-[68ch]">{pattern.summary}</p>
        <ul aria-label="Element natywny i kryteria WCAG" className="mt-4 flex flex-wrap items-center gap-2">
          <li>
            <NativeVerdictBadge verdict={pattern.native} />
          </li>
          {pattern.criteria.map((id) => (
            <li key={id}>
              <Link to="/kryteria/$criterionId" params={{ criterionId: id }} className={chip}>
                {id}
              </Link>
            </li>
          ))}
          {pattern.status === "szkic" ? (
            <li>
              <DraftBadge />
            </li>
          ) : null}
        </ul>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <section aria-labelledby="pattern-title">
            <h2 id="pattern-title" className="sr-only">
              Wzorzec
            </h2>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.9375rem]">
              <input
                type="checkbox"
                checked={keyboardOnly}
                onChange={(event) => {
                  setKeyboardOnly(event.target.checked);
                  setBlocked(0);
                }}
                className="size-5 accent-ink"
              />
              Tylko klawiatura
            </label>
            <iframe
              key={run}
              ref={ref}
              src={`/demo/wzorce/${pattern.slug}`}
              title={`Wzorzec: ${pattern.title}${keyboardOnly ? ", tylko klawiatura" : ""}`}
              sandbox="allow-scripts allow-forms"
              data-variant="pattern"
              onLoad={send}
              style={{ height }}
              className="mt-1 block w-full rounded-xs border-2 border-control bg-paper-2"
            />
            {keyboardOnly ? (
              <>
                <p className="mt-2 font-mono text-sm">Zablokowane kliknięcia: {blocked}</p>
                <p aria-live="polite" className="sr-only">
                  {blocked > 0 ? `Kliknięcie zablokowane, ${String(blocked)}. W tym trybie działa tylko klawiatura.` : ""}
                </p>
              </>
            ) : null}
          </section>

          <Exercise steps={pattern.steps} done={done} onRestart={restart} />

          <details className="disclosure mt-6 rounded border border-control">
            <summary className="flex min-h-11 cursor-pointer items-center px-3.5 font-semibold">Kod</summary>
            <pre className="overflow-x-auto rounded-b bg-[#101314] px-4 py-3 text-[#e8e6e1]">
              <code className="font-mono text-[0.8125rem] leading-relaxed">{pattern.source}</code>
            </pre>
          </details>
        </div>

        <div className="grid min-w-0 gap-6">
          <PatternLog
            lines={lines}
            onClear={() => {
              setLines([]);
            }}
          />
          <AriaTable rows={pattern.aria} values={values.now} changed={values.changed} />
        </div>
      </div>

      <TermTips terms={terms}>
        {patternSections.map(({ key, title }) => {
          const html = pattern.sections[key];
          return html ? (
            <section key={key} aria-labelledby={key} className="mt-10 border-t-2 border-ink pt-4">
              <h2 id={key} className="text-xl font-bold tracking-tight">
                {title}
              </h2>
              {/* Markdown in content/ is written by us and rendered at build time, so injecting it is safe. */}
              <div className="prose mt-3" data-section={key === "bledy" ? "typowe-bledy" : undefined} dangerouslySetInnerHTML={{ __html: html }} />
            </section>
          ) : null;
        })}
      </TermTips>

      {examples.length > 0 || beforeAfter.length > 0 ? (
        <section aria-labelledby="zepsute" className="mt-10 border-t-2 border-ink pt-4">
          <h2 id="zepsute" className="text-xl font-bold tracking-tight">
            Ten sam błąd w Praktyce
          </h2>
          <ProblemLinks problems={beforeAfter} />
          {examples.length > 0 ? (
            <ul className="mt-3 border-t border-rule">
              {examples.map((example) => (
                <li key={example.slug} className="border-b border-rule">
                  <Link to="/praktyka/$slug" params={{ slug: example.slug }} className="block px-1 py-3 hover:bg-surface">
                    <span className="font-semibold">{example.title}</span>
                    <span className="mt-0.5 block text-[0.9375rem] text-ink-2">{example.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="zrodla" className="mt-10 border-t-2 border-ink pt-4 pb-4">
        <h2 id="zrodla" className="text-xl font-bold tracking-tight">
          Źródła
        </h2>
        <ul className="mt-2">
          {pattern.sources.apg ? (
            <li>
              <a href={pattern.sources.apg} hrefLang="en" className="inline-flex min-h-11 items-center text-accent underline underline-offset-3">
                Wzorzec w WAI-ARIA Authoring Practices (W3C, po angielsku)
              </a>
            </li>
          ) : null}
          <li>
            <a href={pattern.sources.deque} hrefLang="en" className="inline-flex min-h-11 items-center text-accent underline underline-offset-3">
              Przykład w Deque University (po angielsku)
            </a>
          </li>
        </ul>
        <p className="mt-2 max-w-[68ch] text-[0.9375rem] text-ink-2">
          Kod wzorca jest nasz, napisany na podstawie opisu w WAI-ARIA Authoring Practices. Nie kopiujemy kodu Deque.
        </p>
      </section>
    </article>
  );
}
