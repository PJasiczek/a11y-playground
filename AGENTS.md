I'm Piotr. You're my agent. We will be working together a lot, so I thought it would be worth introducing myself.

In my work, I focus heavily on the accessibility of the products I build. I care about making sure what we ship is usable by as wide a range of people as possible, including people with disabilities.

I love to build. I focus on building complex things as simple as possible. I love to find ways to reduce complexity when solving problems.

I wanted to share some of my preferences here so we can be more aligned as we work together.

## Editing this file

- Don't edit CLAUDE.md unless I explicitly ask for a change to it directly in my message. Don't infer or propose edits to this file on your own.

## When to stop and ask

- These need my explicit go-ahead every single time, even if you've been given full/unrestricted access: creating or switching a branch, committing, pushing a branch, and opening anything for review. Propose the exact thing you're about to do, then wait.
- Never touch production, live databases, or daily-driver build/preview channels unless explicitly told to. When a task is adjacent to any of them, name what you are about to touch before touching it.
- Be careful with destructive actions that are not explicitly requested by me.
- If a rule in this file conflicts with what I say in a message, the message wins for that task. Say which rule you're setting aside, so I can catch it if I didn't mean it.

## Coding preferences - general

- Keep things simple. Channel "yagni" energy unless told otherwise.
- Match the ceremony to the task. Don't spawn subagents or a multi-agent panel for work a single agent finishes in one pass. Delegation is for breadth or adversarial review, not for ordinary tasks. When several agents do work in parallel, state file ownership up front so they do not collide.
- Typesafety is useful, take advantage of it.
- Don't be scared to propose bold ideas if they can meaningfully benefit our work.
- Tests are good! Endless smoke tests, "regression tests" for feature deletions, etc, much less good. Tests should be focused, not slop.
- Comments are a great way to clarify functionality and how code is used. Don't comment every line, but feel free to describe (concisely) how functions are used above function definitions, classes, etc.
- Keep comments up to date! When making changes, it's important to keep things in sync.
- When you add a feature or change how an existing one works, update `README.md` in the same change. Write it in English and follow the `create-readme` skill. If that skill isn't available in the session, say so and keep the README's existing structure. Add or refresh screenshots of the affected UI, store them next to the README's existing images (or in `docs/screenshots/` if there are none), and delete screenshots that no longer match the app.

## Temporary and working files

- All temporary and working files and folders (scratch scripts, intermediate outputs, logs, test data) go inside the project directory, never in `/tmp` or other system temp directories. They must be covered by `.gitignore`. If they aren't, add the entry before creating them and include that change in the same commit as the current work.

## Coding preferences (Typescript focused)

- `any` is the enemy. Inferred types are our friend. Our systems should adapt to changes, instead of requiring changes everywhere.
- If your TS code looks like a Python dev wrote it, it is bad TS code.
- Avoid one-line functions that are just casting wrappers.
- Write TypeScript in ways that Matt Pocock and would be proud of.
- If not already specified in project, I generally like to use the following tech: Convex, Tailwind, React, Vite, pnpm
- When building more complex web and react native apps, I like to pull in Zustand, React Query, Tanstack Start, Clerk (or better-auth if selfhosting), and ArkType (or zod if perf isn't an issue)

## Questions are read-only

- A question is a request for an answer, not for changes. If the message opens with "how hard would it be", "what are your thoughts", "why does", "should we", "is it possible", "can Convex do X", or otherwise asks rather than instructs: answer it, and do not edit files.
- "Can you", "could you" or "czy możesz" followed by a task is an instruction, not a question, even though it is phrased as one. Capability questions about a tool or system ("can Convex do X") stay questions.
- If the answer is obvious and the change is trivial, still answer first and offer the change. Ask before making it.

## Plans and mockups

- When I ask for a plan or mockups, deliver the plan or the mockups and nothing else. If something is unclear, ask before you write it, in one round of questions rather than a drip.
- Don't implement any part of a plan while writing it, not even the trivial or obvious bits. No file edits, no scaffolding, no starting on step one.
- I'll say when I'm ready to build it. Until then the plan stays a document.

## Visual and design work

- Do not edit real components first. Any non-trivial UI or layout change starts with several distinct static mocks, published with the `html-communication` skill, with the URL reported back. Picking a variant is my call, so the stop-and-wait rule in "Plans and mockups" applies here too.
- Copy-only changes are exempt from the mock cycle. Give me the wording variants in chat and wait for a pick.
- If the `html-communication` skill isn't available in the session, say so, write the mock files to `docs/design/...` anyway, and hand me the paths.
- Plans, specs and mocks land under `docs/design/<yyyy-mm-dd>-<slug>/`. Mocks: `<slug>.html`. Plans/specs: `<slug>.en.html` + `<slug>.pl.html`. Commit them to git and keep the full history — do not delete rejected variants once a pick is made.
- When opening the PR that implements the chosen variant, note in the description which variant won and why, with a link to the mock file in `docs/design/...`.
- Mocks follow `frontend-design`: palette, type, layout, and motion are chosen per brief, not fixed here.
- Accessibility is a requirement, not an add-on. Target WCAG 2.2 Level AA, plus 2.3.3 and 2.5.5 at AAA, which we opt into. The full checklist lives in `docs/accessibility.md` — read it before writing mocks or UI code.

## Branches

- Start a new branch whenever you begin fixing a bug or starting a new feature — not automatically on every new session. If a new session continues the same logical piece of work (e.g. following up on the same fix or feature), stay on the existing branch instead of creating another one.
- Never commit directly to `master`. If you are on `master` and about to make changes, stop and propose a branch first.
- Propose the branch name and wait for a go-ahead before creating or switching.
- Name the branch after the work: `fix/web-thread-cpu-spike`, `feat/auth-magic-link`.
- If a branch was cut before the shape of the work was clear, rename it once it is: read `git diff master...HEAD`, pick a descriptive name, run `git branch -m <new-name>`, confirm with `git branch`. If the branch is already on the remote, say so and ask before deleting the old remote name.
- One branch per logical piece of work. If a second unrelated concern lands on the branch, stop and propose how to split it (which commits move where) before touching anything.

## Commits

### Planning the series

- Plan the commit sequence before writing code. If the work needs more than one commit, say what they will be and in what order, then work in that order instead of untangling one big diff at the end.
- Keep mechanical changes out of behavior changes. Renames, file moves, formatting and import reshuffles get their own commit, before or after the change that alters behavior, never mixed into it.
- Dependency bumps, config edits and generated files go in separate commits from feature work.
- Tests ship with the code they cover. Docs and comments ship with the change they describe.
- Order the series so the history reads in the order the work happened. Groundwork first, the real change next, cleanup last.
- Every commit stands on its own: one purpose each, the repo's lint, build and tests pass at each one, and the tree is never broken halfway through the series.
- If a commit can't pass lint, build or tests, don't reorder or squash to hide it. Report which commit fails and propose a fix: move a dependency earlier, merge two steps, change the order, or commit as-is if the breakage is unavoidable. Then wait for a go-ahead. This is the one procedure for a failing check, at planning time and at commit time alike.
- If a diff has grown past what one commit message can honestly describe, stop and propose the split before staging anything.

### Making a commit

- Show the proposed commit message and wait for a go-ahead before committing.
- Run the repo's lint, build and tests before committing (`pnpm lint`, `pnpm build` and `pnpm test` unless the project uses something else). If any of them fails, follow the failing-check rule in "Planning the series". Skip a check only when explicitly told to.
- If files are already staged, commit only those. If nothing is staged, show `git status` and `git diff`, propose which files belong in this commit, and wait for a go-ahead. Never stage everything by default.
- Read the diff before writing the message and make sure the message matches what actually changed.
- Format `<type>(<scope>): <description>`. Types: feat, fix, docs, style, refactor, perf, test, chore.
- Imperative mood, present tense. "add retry to upload", not "added retry".
- First line under 72 characters, no trailing period.
- No model/agent attribution in commit messages. No "Generated with Claude", no "Co-Authored-By:" footers.
- No "fix typo", "address review" or "oops" commits. Amend, or use `git commit --fixup` plus `git rebase -i --autosquash`. The same applies after review, which means the branch is already on the remote — see "Rewriting history".

### Rewriting history

- `--amend`, `--fixup` with `--autosquash`, and rebases all rewrite commits and give them new SHAs. On a branch that hasn't been pushed, go ahead. On a branch that is already on the remote, this needs a force push: always ask first, and use `git push --force-with-lease`, never `git push --force`.

## Pull Requests

- Share the proposed title/description and wait for a go-ahead before pushing a branch for review.
- Rebase onto latest `master` before opening. Stale branches conflict and waste a review round. If the branch is already pushed, this needs a force push — see "Rewriting history".
- Don't add any model/agent attribution info (e.g. "Generated with Claude", "Co-Authored-By: " or similar footers) to PR descriptions.
- Make sure titles follow conventions from the repo. They should be simple and easy to understand. Conventional commit styles in projects that use them, i.e. "fix(web): new threads no longer spike CPU"
- PR descriptions should aim for simplicity. Open with a minimal, clear description of the problem. Follow up with how you solved it.
- **Hand me a link, don't open the PR.** Push the branch, then give me a prefilled compare URL: `https://github.com/<owner>/<repo>/compare/master...<branch>?expand=1`, with `title` and `body` query params filled in and URL-encoded. I open it, check the title and description, and merge it myself.
  - No `gh pr create`, no API. The link is the handoff.
  - The link must open a normal PR, not a draft. No draft flag, no "Draft:" / "WIP:" prefix in the title. Drafts do not get review-bot coverage.
