import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { brokenExamples, tags } from "./axe";

/** Focuses an element and presses a key on it, the way a keyboard user gets there with Tab. */
async function press(page: Page, locator: ReturnType<Page["locator"]>, key: string) {
  await locator.focus();
  await page.keyboard.press(key);
}

/** Answers every question of the lesson quiz with its first option, from the keyboard. */
async function answerQuiz(page: Page) {
  const quiz = page.getByRole("region", { name: "Sprawdź się" });
  for (;;) {
    await press(page, quiz.locator("input:not([disabled])").first(), "Space");
    await press(page, quiz.getByRole("button", { name: "Sprawdź" }), "Enter");
    const next = quiz.getByRole("button", { name: /Następne pytanie|Zobacz wynik/ });
    const last = (await next.textContent()) === "Zobacz wynik";
    await page.keyboard.press("Enter");
    if (last) break;
    await expect(quiz.locator("legend")).toBeFocused();
  }
  await expect(quiz.getByRole("heading", { name: /^Wynik: \d z \d$/ })).toBeFocused();
}

test("the developer path can be completed from the keyboard and survives a reload", async ({ page }) => {
  await page.goto("/sciezki");
  await press(page, page.getByRole("link", { name: "Programista", exact: true }), "Enter");
  await expect(page.getByRole("heading", { level: 1, name: /Programista/ })).toBeFocused();
  await press(page, page.getByRole("link", { name: /^Zacznij: 01/ }), "Enter");

  for (let lesson = 1; ; lesson++) {
    await expect(page.getByText(`Lekcja ${String(lesson)} z 7`)).toBeVisible();
    if (lesson === 1) await answerQuiz(page);
    const done = page.getByRole("button", { name: "Lekcja ukończona" });
    await press(page, done, "Space");
    await expect(done).toHaveAttribute("aria-pressed", "true");
    const next = page.getByRole("navigation", { name: "Lekcje ścieżki" }).getByRole("link", { name: /Następna|Wróć do ścieżki/ });
    const end = (await next.textContent())?.includes("Wróć do ścieżki") ?? false;
    await press(page, next, "Enter");
    if (end) break;
  }

  await expect(page.getByText("Ścieżka ukończona: wszystkie 7 lekcji.")).toBeVisible();
  await expect(page.getByText(/^quiz \d z 3$/)).toBeVisible();
  await page.reload();
  await expect(page.getByText("Ścieżka ukończona: wszystkie 7 lekcji.")).toBeVisible();
  await page.goto("/sciezki");
  await expect(page.getByText("ukończono 7 z 7")).toBeVisible();
});

test("a lesson and its quiz have no axe violations before checking, after checking and on the summary", async ({ page }) => {
  await page.goto("/sciezki/programista/klawiatura-i-fokus");
  const quiz = page.getByRole("region", { name: "Sprawdź się" });
  const scan = async () => {
    const { violations } = await new AxeBuilder({ page }).withTags(tags).exclude(brokenExamples).analyze();
    expect(violations).toEqual([]);
  };
  await expect(quiz.getByRole("button", { name: "Sprawdź" })).toBeVisible();
  await scan();
  await quiz.getByRole("radio", { name: /2\.1\.1/ }).check();
  await quiz.getByRole("button", { name: "Sprawdź" }).click();
  await expect(quiz.getByText(/^✓ Dobrze\.$/)).toBeVisible();
  await scan();
  await answerQuizFrom(page, quiz);
  await scan();
});

/** Finishes a quiz that already has its current question checked. */
async function answerQuizFrom(page: Page, quiz: ReturnType<Page["locator"]>) {
  for (;;) {
    const next = quiz.getByRole("button", { name: /Następne pytanie|Zobacz wynik/ });
    const last = (await next.textContent()) === "Zobacz wynik";
    await next.click();
    if (last) break;
    await quiz.locator("input:not([disabled])").first().check();
    await quiz.getByRole("button", { name: "Sprawdź" }).click();
  }
  await expect(quiz.getByRole("heading", { name: /^Wynik:/ })).toBeVisible();
}
