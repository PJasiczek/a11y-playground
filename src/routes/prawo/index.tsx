import { createFileRoute } from "@tanstack/react-router";
import { SectionPlaceholder } from "~/components/section-placeholder";

export const Route = createFileRoute("/prawo/")({
  head: () => ({ meta: [{ title: "Prawo · a11y playground" }] }),
  component: () => (
    <SectionPlaceholder
      title="Prawo"
      lead="Kogo dotyczą polskie przepisy o dostępności, od kiedy, i które kryteria z nich wynikają."
    />
  ),
});
