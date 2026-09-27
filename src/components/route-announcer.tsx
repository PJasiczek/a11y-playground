import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * A single-page app does not tell screen readers that the page changed. After
 * every client-side path change this moves focus to the page's h1 and reads the
 * new title in a polite live region. Search-param and hash changes are ignored,
 * so filtering a list does not throw the reader back to the top.
 * Render once, in the root layout.
 */
export function RouteAnnouncer() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(
    () =>
      router.subscribe("onRendered", ({ fromLocation, pathChanged }) => {
        if (!fromLocation || !pathChanged) return;
        const heading = document.querySelector<HTMLElement>("main h1");
        if (heading) {
          heading.tabIndex = -1;
          heading.focus();
        }
        setMessage(document.title);
      }),
    [router],
  );

  return (
    <p aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </p>
  );
}
