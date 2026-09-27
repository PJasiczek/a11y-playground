import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { criterionContent } from "./criterion-content";
import { criteria } from "./wcag";

// Server functions over content/kryteria. They keep the Markdown parser and the raw files
// out of the client bundle.

const CriterionIdInput = type.enumerated(...criteria.map((c) => c.id));

/** Full editorial content of one criterion, or null when nobody has written it yet. */
export const getCriterionContent = createServerFn({ method: "GET" })
  .validator(CriterionIdInput)
  .handler(({ data }) => criterionContent.get(data) ?? null);
