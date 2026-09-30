import { createServerFn } from "@tanstack/react-start";
import { glossary } from "./glossary";
import { simulators } from "./simulators";

// Server functions for /symulatory. They keep the Markdown parser and the content files out of
// the client bundle, as long as this file exports nothing but server functions.

/** Every simulator kind in order, with the short definitions of the glossary terms they mark. */
export const getSimulators = createServerFn({ method: "GET" }).handler(() => {
  const list = [...simulators.values()];
  const terms: Record<string, { term: string; html: string }> = {};
  for (const slug of list.flatMap((simulator) => simulator.terms)) {
    const entry = glossary.get(slug);
    if (entry) terms[slug] = { term: entry.term, html: entry.html };
  }
  return { simulators: list, terms };
});
