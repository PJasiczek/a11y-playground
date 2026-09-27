import { createFileRoute } from "@tanstack/react-router";
import { SectionPlaceholder } from "~/components/section-placeholder";

export const Route = createFileRoute("/kryteria/")({
  head: () => ({ meta: [{ title: "Kryteria · a11y playground" }] }),
  component: () => (
    <SectionPlaceholder
      title="Kryteria"
      lead="Każde kryterium WCAG 2.1 i 2.2 w jednym zdaniu, z tym, jak je spełnić i jak to sprawdzić."
    />
  ),
});
