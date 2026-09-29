import { describe, expect, test } from "vitest";
import { staleEntries, type Verification } from "./markdown";
import { learningPaths, parseLesson, parsePath, parseQuiz } from "./paths";

const quiz = `
- id: div
  prompt: Które kryterium łamie ten kod?
  code: <div onclick="x()">Zapisz</div>
  options:
    - { criterion: "2.1.1", correct: true, why: Div nie dostaje fokusu. }
    - { criterion: "1.4.3", why: Nie ma tu kolorów. }
- id: okno
  prompt: Co powinno działać w oknie modalnym?
  options:
    - { text: Fokus w oknie, correct: true, why: Tak. }
    - { text: Esc zamyka, correct: true, why: Tak. }
    - { text: Tab wychodzi pod okno, why: Nie. }
- id: obrys
  prompt: Co narusza usunięcie obrysu fokusu?
  options:
    - { criterion: "2.4.7", correct: true, why: Fokus musi być widoczny. }
    - { criterion: "2.4.3", why: Kolejność się nie zmienia. }
`;

const lesson = `---
title: Klawiatura
summary: Krótko.
criteria: ["2.1.1"]
examples: [okno-modalne-i-fokus]
law: [ustawa-2019-848/art-5]
keep: [Jedno., Drugie.]
status: szkic
---
Treść lekcji.
`;

const index = `---
title: Programista
role: programista
summary: Krótko.
lessons: [a, b]
status: szkic
---
Wstęp.
`;

const fail = (reason: string) => new Error(reason);

describe("path files", () => {
  // Loading the module parses every folder in content/sciezki and throws on the first bad one.
  test("all parse, and verified ones are fresh", () => {
    const entries = [...learningPaths.values()].flatMap((path): [string, Verification][] => [
      [path.slug, path],
      ...path.lessons.map((l): [string, Verification] => [`${path.slug}/${l.slug}`, l]),
    ]);
    expect(staleEntries(entries)).toEqual([]);
  });
});

describe("parseQuiz", () => {
  test("names criteria from the registry and derives the question kind", () => {
    const [first, second] = parseQuiz(quiz, fail);
    expect(first?.options[0]).toEqual({ label: "2.1.1 Klawiatura", criterion: "2.1.1", correct: true, why: "Div nie dostaje fokusu." });
    expect(first?.code).toBe('<div onclick="x()">Zapisz</div>');
    expect(first?.multiple).toBe(false);
    expect(second?.multiple).toBe(true);
  });

  test.each([
    ["too few questions", quiz.split("- id: obrys")[0] ?? "", /3 to 5 questions/],
    ["a question with no correct option", quiz.replace("correct: true, why: Fokus", "why: Fokus"), /"obrys" has no correct option/],
    ["a repeated id", quiz.replace("id: obrys", "id: div"), /"div" is repeated/],
    ["an unknown criterion", quiz.replace('"2.4.3"', '"9.9.9"'), /unknown criterion 9\.9\.9/],
    ["an option with both text and criterion", quiz.replace("{ text: Esc zamyka,", '{ criterion: "2.1.1", text: Esc zamyka,'), /either text or criterion/],
    ["an option without why", quiz.replace(", why: Nie. }", " }"), /why/],
  ])("rejects %s", (_, input, message) => {
    expect(() => parseQuiz(input, fail)).toThrow(message);
  });
});

describe("parseLesson", () => {
  test("renders the body and resolves its references", () => {
    const parsed = parseLesson("a.md", "a", lesson, quiz);
    expect(parsed.html).toBe("<p>Treść lekcji.</p>\n");
    expect(parsed.law).toEqual(["ustawa-2019-848/art-5"]);
    expect(parsed.quiz).toHaveLength(3);
  });

  test.each([
    ["a missing quiz", lesson, undefined, /a\.quiz\.yaml is missing/],
    ["an unknown example", lesson.replace("okno-modalne-i-fokus", "nie-ma"), quiz, /unknown examples: nie-ma/],
    ["an unknown provision", lesson.replace("art-5]", "art-999]"), quiz, /unknown provisions/],
    ["a single keep line", lesson.replace("keep: [Jedno., Drugie.]", "keep: [Jedno.]"), quiz, /keep/],
    ["a verified lesson without a date", lesson.replace("status: szkic", "status: zweryfikowane"), quiz, /lastVerified/],
  ])("rejects %s", (_, source, quizSource, message) => {
    expect(() => parseLesson("a.md", "a", source, quizSource)).toThrow(message);
  });
});

describe("parsePath", () => {
  const file = { source: lesson, quiz };
  const lessons = new Map([
    ["b", file],
    ["a", file],
  ]);

  test("orders lessons by the lessons list", () => {
    const path = parsePath("programista", { index, lessons });
    expect(path.lessons.map((l) => l.slug)).toEqual(["a", "b"]);
    expect(path.role).toBe("programista");
  });

  test.each([
    ["a listed lesson without a file", new Map([["a", file]]), /missing files: b/],
    ["a lesson file that is not listed", new Map([...lessons, ["c", file]]), /not in lessons: c/],
  ])("rejects %s", (_, input, message) => {
    expect(() => parsePath("programista", { index, lessons: input })).toThrow(message);
  });
});
