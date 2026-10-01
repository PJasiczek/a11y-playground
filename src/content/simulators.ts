import { type } from "arktype";
import { examples } from "./examples";
import { type Fail, IsoDate, readVerification, splitFrontmatter, Status, type Verification } from "./markdown";
import { createRenderer } from "./render";
import { type SimulationKind, simulationKinds } from "./simulations";
import { type CriterionId, isCriterionId } from "./wcag";

/**
 * What each kind of simulator shows and what it does not, one file per kind in
 * content/symulatory/<kind>.md. Server-only, like the other content modules.
 */

const Frontmatter = type({
  title: "string > 0",
  summary: "0 < string <= 200",
  criteria: "string[] > 0",
  /** Examples the kind teaches most on, for the "Wypróbuj na" links. */
  examples: "string[]",
  /** "Czego to nie pokazuje", shown next to every simulation of this kind. */
  limits: "string > 0",
  status: Status,
  "lastVerified?": IsoDate,
  "+": "reject",
});

export type Simulator = Verification & {
  kind: SimulationKind;
  title: string;
  summary: string;
  criteria: CriterionId[];
  examples: { slug: string; title: string }[];
  limits: string;
  /** The general description, shown when an example has no note of its own. */
  html: string;
  terms: string[];
};

/** Parses one simulator file. Throws with the file and the reason. */
export function parseSimulator(kind: SimulationKind, source: string): Simulator {
  const fail: Fail = (reason) => new Error(`content/symulatory/${kind}.md: ${reason}`);
  const { data, body } = splitFrontmatter(source, fail);
  const meta = Frontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);

  const unknownCriteria = meta.criteria.filter((id) => !isCriterionId(id));
  if (unknownCriteria.length > 0) throw fail(`criteria lists unknown criteria: ${unknownCriteria.join(", ")}`);
  const linked = meta.examples.map((slug) => {
    const example = examples.get(slug);
    if (!example) throw fail(`examples lists an unknown example "${slug}"`);
    return { slug, title: example.title };
  });

  const { terms, render } = createRenderer(fail);
  return {
    ...readVerification(meta, fail),
    kind,
    title: meta.title,
    summary: meta.summary,
    criteria: meta.criteria.filter(isCriterionId),
    examples: linked,
    limits: meta.limits,
    html: render(body.trim()),
    terms,
  };
}

const files = import.meta.glob<string>("/content/symulatory/*.md", { query: "?raw", import: "default", eager: true });

/** Every simulator kind in the order of simulationKinds. A kind without its file fails here. */
export const simulators: ReadonlyMap<SimulationKind, Simulator> = new Map(
  simulationKinds.map((kind) => {
    const source = files[`/content/symulatory/${kind}.md`];
    if (source === undefined) throw new Error(`content/symulatory/${kind}.md is missing`);
    return [kind, parseSimulator(kind, source)];
  }),
);

/** File names in content/symulatory that match no kind, so a typo does not go unnoticed. */
export const strayFiles = Object.keys(files).filter(
  (path) => !simulationKinds.some((kind) => path === `/content/symulatory/${kind}.md`),
);
