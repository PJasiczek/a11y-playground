import type { Line } from "~/content/reading-order";

type Variants = { bad: Line[]; good: Line[] };

/**
 * What a screen reader reads in the broken and the fixed variant, row by row (variant 3B of the
 * simulator mocks), once for reading in order and once for the Tab order. Rows that differ carry
 * "≠" and a hidden "(różni się)", so the difference is not shown by shading alone.
 */
export function ReadingTables({ reading, tab }: { reading: Variants; tab: Variants }) {
  return (
    <section aria-labelledby="reading-title" className="mt-6">
      <h2 id="reading-title" className="text-lg font-bold">
        Co przeczyta czytnik ekranu
      </h2>
      <ReadingTable caption="Czytanie po kolei" rows={reading} />
      <ReadingTable caption="Kolejność Tab" rows={tab} />
      <p className="mt-3 max-w-[68ch] text-[0.9375rem] text-ink-2">
        Lista policzona z kodu przykładu, dla stanu tuż po załadowaniu. Prawdziwy czytnik doda własne sformułowania i
        skróty. Sprawdź przykład w NVDA albo VoiceOverze.
      </p>
    </section>
  );
}

function ReadingTable({ caption, rows }: { caption: string; rows: Variants }) {
  const count = Math.max(rows.bad.length, rows.good.length);
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse bg-surface text-[0.9375rem]">
        <caption className="mb-2 text-left font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">{caption}</caption>
        <thead>
          <tr className="bg-paper-2 font-mono text-[0.8125rem] tracking-wider uppercase">
            <th scope="col" className="w-20 border border-rule px-3 py-2 text-left">
              Krok
            </th>
            <th scope="col" className="border border-rule px-3 py-2 text-left text-bad">
              <span aria-hidden="true">✕ </span>Zepsute
            </th>
            <th scope="col" className="border border-rule px-3 py-2 text-left text-good">
              <span aria-hidden="true">✓ </span>Poprawne
            </th>
          </tr>
        </thead>
        <tbody>
          {count === 0 ? (
            <tr>
              <td colSpan={3} className="border border-rule px-3 py-2 text-ink-2">
                Nic. Klawisz Tab omija oba przykłady.
              </td>
            </tr>
          ) : (
            Array.from({ length: count }, (_, index) => {
              const bad = rows.bad[index];
              const good = rows.good[index];
              const differs = spoken(bad) !== spoken(good);
              return (
                <tr key={index} className={differs ? "bg-marker/25" : undefined}>
                  <th scope="row" className="border border-rule px-3 py-2 text-left font-mono text-[0.8125rem] font-normal text-ink-2">
                    {index + 1}
                    {differs ? (
                      <>
                        <span aria-hidden="true" className="ml-1 font-bold text-ink">
                          ≠
                        </span>
                        <span className="sr-only"> (różni się)</span>
                      </>
                    ) : null}
                  </th>
                  <td className="border border-rule px-3 py-2">
                    <Announcement line={bad} />
                  </td>
                  <td className="border border-rule px-3 py-2">
                    <Announcement line={good} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/** The line as a screen reader would say it, for comparing the two variants. */
function spoken(line: Line | undefined) {
  return line ? `${line.text}|${line.role ?? ""}|${line.missing ?? ""}` : "";
}

function Announcement({ line }: { line: Line | undefined }) {
  if (!line) return <span className="text-ink-2 italic">nic</span>;
  return (
    <>
      {line.missing === "nazwa" ? <span className="font-semibold text-bad">bez nazwy</span> : line.text}
      {line.role ? <span className="font-mono text-[0.8125rem]">{line.text || line.missing ? ", " : ""}{line.role}</span> : null}
      {line.missing === "rola" ? " " : null}
      {line.missing === "rola" ? (
        <span className="font-mono text-[0.8125rem] font-semibold text-bad">
          (tekst, nie przycisk)
        </span>
      ) : null}
    </>
  );
}
