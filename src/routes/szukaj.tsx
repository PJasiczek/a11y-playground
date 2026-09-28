import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import MiniSearch, { type SearchResult } from "minisearch";
import { type ReactNode, type SubmitEvent, useEffect, useState } from "react";
import { type SearchDoc, searchOptions } from "~/search/options";
import { countOf } from "~/lib/plural";

export const Route = createFileRoute("/szukaj")({
  validateSearch: (search: Record<string, unknown>) => (typeof search.q === "string" && search.q.trim() ? { q: search.q } : {}),
  head: () => ({ meta: [{ title: "Szukaj · a11y playground" }] }),
  component: SearchPage,
});

type Hit = SearchResult & Pick<SearchDoc, "kind" | "ref" | "title" | "summary">;

// MiniSearch returns stored fields untyped; this checks the ones listed in storeFields.
function isHit(result: SearchResult): result is Hit {
  const { kind, ref, title, summary } = result;
  return (
    (kind === "kryterium" || kind === "pojecie") &&
    typeof ref === "string" &&
    typeof title === "string" &&
    typeof summary === "string"
  );
}

// Loaded once per session, on the first visit to /szukaj, so no other page pays for it.
let indexPromise: Promise<MiniSearch<SearchDoc>> | undefined;
function loadIndex() {
  indexPromise ??= fetch("/search-index.json")
    .then((response) => response.text())
    .then((json) => MiniSearch.loadJSON<SearchDoc>(json, searchOptions));
  return indexPromise;
}

/**
 * Search over criteria and the glossary (screen 7 of variant A, with a visible label instead of
 * a placeholder). The form works as a plain GET to /szukaj?q=; the index is searched in the
 * browser and the result count is announced in a status region.
 */
function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  // Results remember the query they answer, so a new query never shows the previous results.
  const [results, setResults] = useState<{ q: string; hits: Hit[] } | null>(null);
  const hits = q && results?.q === q ? results.hits : null;

  useEffect(() => {
    if (!q) return;
    let current = true;
    void loadIndex().then((index) => {
      if (current) setResults({ q, hits: index.search(q).filter(isHit) });
    });
    return () => {
      current = false;
    };
  }, [q]);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q");
    void navigate({ search: typeof query === "string" && query.trim() ? { q: query.trim() } : {} });
  };

  const criteria = hits?.filter((hit) => hit.kind === "kryterium") ?? [];
  const terms = hits?.filter((hit) => hit.kind === "pojecie") ?? [];
  const status = !q ? "" : hits ? `${countOf(hits.length, ["wynik", "wyniki", "wyników"])} dla „${q}”` : "Szukam…";

  return (
    <>
      <h1 className="pt-8 pb-4 text-[1.875rem] font-bold tracking-tight">Szukaj</h1>
      {/* Keyed by the query so the field shows the current query after back and forward. */}
      <form key={q} role="search" action="/szukaj" method="get" onSubmit={onSubmit} className="max-w-152">
        <label htmlFor="q" className="mb-1.5 block font-semibold">
          Szukaj w kryteriach i słowniku
        </label>
        <p id="q-hint" className="mb-2 text-[0.9375rem] text-ink-2">
          Wpisz numer, nazwę albo problem, na przykład 1.4.3, kontrast, modal, placeholder.
        </p>
        <div className="flex rounded border-2 border-ink bg-surface">
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            aria-describedby="q-hint"
            className="min-h-12 min-w-0 flex-1 bg-transparent px-3.5 text-base text-ink outline-offset-0"
          />
          <button type="submit" className="min-h-12 border-l-2 border-ink bg-marker px-4 font-bold text-on-marker">
            Szukaj
          </button>
        </div>
      </form>

      <noscript>
        <p className="mt-4">
          Wyszukiwarka działa w przeglądarce i potrzebuje JavaScriptu. Bez niego przejrzyj{" "}
          <a href="/kryteria">listę kryteriów</a> albo <a href="/slownik">słownik</a>.
        </p>
      </noscript>

      <p role="status" className="mt-4 font-mono text-sm text-ink-2">
        {status}
      </p>

      {hits && hits.length === 0 ? (
        <p className="mt-4 max-w-[60ch]">
          Nic nie pasuje. Spróbuj krótszego słowa albo przejrzyj{" "}
          <Link to="/kryteria" className="text-accent underline underline-offset-3">
            listę kryteriów
          </Link>
          .
        </p>
      ) : null}

      {criteria.length > 0 ? (
        <ResultGroup title="Kryteria">
          {criteria.map((hit) => (
            <li key={hit.ref} className="border-t border-rule last:border-b">
              <Link
                to="/kryteria/$criterionId"
                params={{ criterionId: hit.ref }}
                className="grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-1 px-1 py-3.5 hover:bg-surface max-sm:grid-cols-1"
              >
                <span className="font-mono text-[0.8125rem] font-semibold text-ink-2">{hit.ref}</span>
                <span className="text-[1.0625rem] font-semibold">
                  {hit.title}
                  {hit.summary ? <span className="mt-1 block text-[0.9375rem] font-normal text-ink-2">{hit.summary}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ResultGroup>
      ) : null}

      {terms.length > 0 ? (
        <ResultGroup title="Słownik">
          {terms.map((hit) => (
            <li key={hit.ref} className="border-t border-rule last:border-b">
              <Link
                to="/slownik"
                hash={hit.ref}
                className="grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-1 px-1 py-3.5 hover:bg-surface max-sm:grid-cols-1"
              >
                <span className="font-mono text-[0.8125rem] font-semibold text-ink-2">pojęcie</span>
                <span className="text-[1.0625rem] font-semibold">
                  {hit.title}
                  <span className="mt-1 block text-[0.9375rem] font-normal text-ink-2">{hit.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ResultGroup>
      ) : null}
    </>
  );
}

function ResultGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`wyniki-${title}`} className="mt-8">
      <h2 id={`wyniki-${title}`} className="mb-2 font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">
        {title}
      </h2>
      <ul>{children}</ul>
    </section>
  );
}
