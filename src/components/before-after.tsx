import { Link } from "@tanstack/react-router";

/**
 * Links from a criterion, example or pattern page to the problems of the whole-page demo that
 * show the same thing. Renders nothing when there are none.
 */
export function ProblemLinks({ problems }: { problems: { number: number; title: string }[] }) {
  if (problems.length === 0) return null;
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-3 text-[0.9375rem]">
      <span className="text-ink-2">Na stronie przed i po:</span>
      {problems.map(({ number, title }) => (
        <Link
          key={number}
          to="/praktyka/przed-i-po/$problem"
          params={{ problem: String(number) }}
          className="inline-flex min-h-11 items-center text-accent underline underline-offset-3"
        >
          problem {number}, {title}
        </Link>
      ))}
    </p>
  );
}
