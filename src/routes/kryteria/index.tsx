import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type } from "arktype";
import { Chip, FilterGroup } from "~/components/filters";
import { DraftBadge, LevelBadge, NewBadge } from "~/components/level-badge";
import { getCriteriaOverview } from "~/content/content.functions";
import { type Role, roles } from "~/content/sections";
import {
  criteria,
  inVersion,
  isNewIn22,
  isObsolete,
  type Level,
  levels,
  principles,
  type CriterionId,
  versions,
} from "~/content/wcag";

const VersionParam = type.enumerated(...versions);
const PrincipleParam = type.enumerated(...principles.map((p) => p.num));

/**
 * Filters live in the URL so a filtered list can be shared as a link. Defaults are left out
 * of the URL, and anything invalid is dropped rather than turned into an error page.
 */
function validateSearch(search: Record<string, unknown>) {
  const { wersja, poziom, zasada, rola } = search;
  const picked = Array.isArray(poziom) ? levels.filter((level) => poziom.includes(level)) : [];
  const pickedRoles = Array.isArray(rola) ? roles.filter((role) => rola.includes(role)) : [];
  return {
    ...(VersionParam.allows(wersja) && wersja !== "2.2" ? { wersja } : {}),
    ...(picked.length > 0 && picked.length < levels.length ? { poziom: picked } : {}),
    ...(PrincipleParam.allows(zasada) ? { zasada } : {}),
    ...(pickedRoles.length > 0 ? { rola: pickedRoles } : {}),
  };
}

export const Route = createFileRoute("/kryteria/")({
  validateSearch,
  loader: () => getCriteriaOverview(),
  head: () => ({ meta: [{ title: "Kryteria · a11y playground" }] }),
  component: CriteriaPage,
});

function CriteriaPage() {
  const overview = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const version = search.wersja ?? "2.2";
  const pickedLevels: readonly Level[] = search.poziom ?? levels;
  const inScope = criteria.filter((c) => inVersion(c, version));
  // No role picked means no role filter. Every criterion has content with roles, which the
  // completeness test guarantees.
  const pickedRoles: readonly Role[] = search.rola ?? [];
  const matchesRole = (id: CriterionId) =>
    pickedRoles.length === 0 || (overview[id]?.roles.some((role) => pickedRoles.includes(role)) ?? false);
  const shown = inScope.filter(
    (c) => pickedLevels.includes(c.level) && (!search.zasada || c.principle === search.zasada) && matchesRole(c.id),
  );
  const filtered = Object.keys(search).length > 0;

  const setSearch = (next: Parameters<typeof validateSearch>[0]) => {
    void navigate({ search: validateSearch({ ...search, ...next }), replace: true, resetScroll: false });
  };

  const toggleRole = (role: Role) => {
    setSearch({ rola: pickedRoles.includes(role) ? pickedRoles.filter((r) => r !== role) : [...pickedRoles, role] });
  };

  const toggleLevel = (level: Level) => {
    setSearch({ poziom: pickedLevels.includes(level) ? pickedLevels.filter((l) => l !== level) : [...pickedLevels, level] });
  };

  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 pt-8 pb-4">
        <h1 className="text-[1.875rem] font-bold tracking-tight">Kryteria</h1>
        <p role="status" className="font-mono text-sm text-ink-2">
          Pokazuję {shown.length} z {inScope.length} kryteriów WCAG {version}
        </p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-rule pb-5">
        <FilterGroup legend="Wersja">
          {versions.map((v) => (
            <Chip key={v} type="radio" name="wersja" checked={version === v} onChange={() => { setSearch({ wersja: v }); }}>
              {v}
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup legend="Poziom">
          {levels.map((level) => (
            <Chip key={level} type="checkbox" checked={pickedLevels.includes(level)} onChange={() => { toggleLevel(level); }}>
              {level}
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup legend="Zasada">
          <Chip type="radio" name="zasada" checked={!search.zasada} onChange={() => { setSearch({ zasada: undefined }); }}>
            wszystkie
          </Chip>
          {principles.map((p) => (
            <Chip key={p.num} type="radio" name="zasada" checked={search.zasada === p.num} onChange={() => { setSearch({ zasada: p.num }); }}>
              {p.num}. {p.name}
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup legend="Rola">
          {roles.map((role) => (
            <Chip key={role} type="checkbox" checked={pickedRoles.includes(role)} onChange={() => { toggleRole(role); }}>
              {role}
            </Chip>
          ))}
        </FilterGroup>
      </div>

      {filtered ? (
        <p className="py-3">
          <Link to="/kryteria" className="font-semibold text-accent underline underline-offset-3">
            Wyczyść filtry
          </Link>
        </p>
      ) : null}

      {shown.length > 0 ? (
        <ol className="mt-4">
          {shown.map((c) => (
            <li key={c.id} className="border-t border-rule last:border-b">
              <Link
                to="/kryteria/$criterionId"
                params={{ criterionId: c.id }}
                className="grid grid-cols-[4.75rem_1fr] items-baseline gap-x-4 gap-y-1.5 px-2 py-4 hover:bg-surface sm:grid-cols-[4.75rem_1fr_auto]"
              >
                <span className="font-mono text-lg font-bold tracking-tight">{c.id}</span>
                <span className="text-[1.0625rem] font-semibold tracking-tight">
                  {c.name}
                  {overview[c.id] ? (
                    <span className="mt-1 block text-[0.9375rem] font-normal text-ink-2">{overview[c.id]?.summary}</span>
                  ) : null}
                </span>
                <span className="col-start-2 flex flex-wrap items-center gap-1.5 sm:col-start-auto">
                  {isNewIn22(c) ? <NewBadge /> : null}
                  {overview[c.id]?.status === "szkic" ? <DraftBadge /> : null}
                  {isObsolete(c) ? <span className="font-mono text-xs text-ink-2">wycofane w 2.2</span> : null}
                  <LevelBadge level={c.level} />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-ink-2">Żadne kryterium nie spełnia tych filtrów.</p>
      )}
    </>
  );
}
