/**
 * How one option reads after its question is checked: picked and right, picked and wrong,
 * left out although right, or rightly left out.
 */
export type OptionOutcome = "trafiona" | "bledna" | "pominieta" | "slusznie-pominieta";

/** The outcome of each option, given the indexes the reader picked. */
export function optionOutcomes(options: readonly { correct: boolean }[], picked: ReadonlySet<number>): OptionOutcome[] {
  return options.map(({ correct }, i) => {
    if (picked.has(i)) return correct ? "trafiona" : "bledna";
    return correct ? "pominieta" : "slusznie-pominieta";
  });
}

/** A question counts as right only when the picked options are exactly the correct ones. */
export function isRight(options: readonly { correct: boolean }[], picked: ReadonlySet<number>) {
  return optionOutcomes(options, picked).every((outcome) => outcome === "trafiona" || outcome === "slusznie-pominieta");
}
