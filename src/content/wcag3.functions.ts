import { createServerFn } from "@tanstack/react-start";
import { wcag3Groups, wcag3Overview } from "./wcag3";

// Server functions for /wcag-3. They keep the Markdown parser and the content files out of the
// client bundle, as long as this file exports nothing but server functions.

/** The overview of the described draft and every guideline group in draft order. */
export const getWcag3 = createServerFn({ method: "GET" }).handler(() => ({
  overview: wcag3Overview,
  groups: wcag3Groups,
}));
