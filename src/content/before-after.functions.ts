import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { problems } from "./before-after";

// Server functions for /praktyka/przed-i-po. They keep the Markdown parser and the content files
// out of the client bundle, as long as this file exports nothing but server functions.

/** Every problem as a row of the list, in page order. */
export const getProblemRows = createServerFn({ method: "GET" }).handler(() =>
  problems.map(({ number, title, criteria, who, axe, status }) => ({ number, title, criteria, who, axe, status })),
);

/** One problem with its neighbours' numbers and titles, or null for a number that has no problem. */
export const getProblem = createServerFn({ method: "GET" })
  .validator(type("number.integer"))
  .handler(({ data }) => {
    const index = problems.findIndex((problem) => problem.number === data);
    const problem = problems[index];
    if (!problem) return null;
    const neighbour = (at: number) => {
      const other = problems[at];
      return other ? { number: other.number, title: other.title } : null;
    };
    return { problem, previous: neighbour(index - 1), next: neighbour(index + 1), count: problems.length };
  });
