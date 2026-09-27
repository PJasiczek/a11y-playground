import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <h1 className="pt-14 text-[clamp(2rem,5.2vw,3.125rem)] leading-[1.05] font-bold tracking-tight">a11y playground</h1>
  );
}
