import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { type CriterionContent, criterionContent } from "./criterion-content";
import { criteria, type CriterionId } from "./wcag";
import { criterionTexts } from "./wcag-text.gen";

// Server functions over content/kryteria. They keep the Markdown parser and the raw files
// out of the client bundle.

const CriterionIdInput = type.enumerated(...criteria.map((c) => c.id));

/**
 * Everything the criterion page shows beyond the structure: the editorial content (null until
 * written) and the normative Polish text (null where no authorized translation exists).
 */
export const getCriterionPage = createServerFn({ method: "GET" })
  .validator(CriterionIdInput)
  .handler(({ data }) => ({
    content: criterionContent.get(data) ?? null,
    normative: criterionTexts[data] ?? null,
  }));

/** What the criteria list shows per criterion, keyed by id. Criteria without content are absent. */
export const getCriteriaOverview = createServerFn({ method: "GET" }).handler(() => {
  const overview: Partial<Record<CriterionId, Pick<CriterionContent, "summary" | "status">>> = {};
  for (const [id, { summary, status }] of criterionContent) overview[id] = { summary, status };
  return overview;
});
