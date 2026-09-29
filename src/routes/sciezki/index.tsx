import { createFileRoute } from "@tanstack/react-router";
import { SectionPlaceholder } from "~/components/section-placeholder";

export const Route = createFileRoute("/sciezki/")({
  head: () => ({ meta: [{ title: "Ścieżki · a11y playground" }] }),
  component: () => (
    <SectionPlaceholder
      title="Ścieżki"
      lead="Uporządkowane lekcje dla programistów, projektantów, autorów treści i testerów."
    />
  ),
});
