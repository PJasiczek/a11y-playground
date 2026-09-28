import { createFileRoute } from "@tanstack/react-router";
import { SectionPlaceholder } from "~/components/section-placeholder";

export const Route = createFileRoute("/praktyka/")({
  head: () => ({ meta: [{ title: "Praktyka · a11y playground" }] }),
  component: () => (
    <SectionPlaceholder
      title="Praktyka"
      lead="Wersja zepsuta i poprawna obok siebie, z kodem i z tym, co usłyszy czytnik ekranu."
    />
  ),
});
