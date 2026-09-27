import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { criterionContent } from "./criterion-content";
import { criteria, type CriterionId } from "./wcag";

// Server functions over content/kryteria. They keep the Markdown parser and the raw files
// out of the client bundle.

const CriterionIdInput = type.enumerated(...criteria.map((c) => c.id));

/** Full editorial content of one criterion, or null when nobody has written it yet. */
export const getCriterionContent = createServerFn({ method: "GET" })
  .validator(CriterionIdInput)
  .handler(({ data }) => criterionContent.get(data) ?? null);

/** One-sentence summaries for the criteria list, keyed by id. Criteria without content are absent. */
export const getCriterionSummaries = createServerFn({ method: "GET" }).handler(() => {
  const summaries: Partial<Record<CriterionId, string>> = {};
  for (const [id, content] of criterionContent) summaries[id] = content.summary;
  return summaries;
});
