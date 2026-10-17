import { useState, useSyncExternalStore } from "react";

const noop = () => () => {};

type Result = "copied" | "failed";

const messages: Record<Result, string> = {
  copied: "Skopiowano adres",
  failed: "Nie udało się skopiować. Zaznacz adres i skopiuj go ręcznie.",
};

/**
 * The contact address as a large mailto: link, with "Kopiuj adres" for readers without a mail
 * program, where the link does nothing (variant B of the contact mocks). The result goes to a
 * status region and stays there; focus stays on the button. Without JavaScript only the link shows.
 */
export function CopyAddress({ email }: { email: string }) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [result, setResult] = useState<Result | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setResult("copied");
    } catch {
      setResult("failed");
    }
  }

  return (
    <div className="mt-6 border-t-2 border-ink border-b border-b-rule py-5">
      <p className="font-mono text-xs font-semibold tracking-[0.08em] text-ink-2 uppercase">E-mail</p>
      <a
        href={`mailto:${email}`}
        className="mt-1 inline-flex min-h-11 items-center text-[1.375rem] font-bold tracking-tight wrap-anywhere text-accent underline underline-offset-3 sm:text-[1.625rem]"
      >
        {email}
      </a>
      {hydrated ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={() => void copy()}
            className="inline-flex min-h-11 items-center rounded border-2 border-ink bg-paper px-4 font-semibold text-ink hover:bg-paper-2"
          >
            Kopiuj adres
          </button>
          <p role="status" className={`font-semibold ${result === "failed" ? "text-bad" : "text-good"}`}>
            {result === "copied" ? <span aria-hidden="true">✓ </span> : null}
            {result ? messages[result] : null}
          </p>
        </div>
      ) : null}
    </div>
  );
}
