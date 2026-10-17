import { createServerFn } from "@tanstack/react-start";
import { standalonePage } from "./pages";

// Server functions for the standalone pages, which keep the Markdown parser out of the client bundle.

/** The privacy policy for /prywatnosc. */
export const getPrivacyPolicy = createServerFn({ method: "GET" }).handler(() => standalonePage("prywatnosc"));

/** The contact page for /kontakt. */
export const getContactPage = createServerFn({ method: "GET" }).handler(() => standalonePage("kontakt"));
