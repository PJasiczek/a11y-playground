/**
 * Writes the Markdown files of content/ from Notion, in the layout described in notion.ts.
 * Runs before every build (`pnpm build`) and by hand with `pnpm import:notion` for local work.
 * Every page is fetched before anything on disk changes, so a failed run leaves the old files.
 * Files whose page is gone from Notion are removed. Pass a folder to write somewhere other than content/.
 */
import { globSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { entryFile, fromNotion, inBatches, notionClient, notionEnv } from "./notion.ts";

const out = process.argv[2] ?? "content";
const { token, root } = notionEnv();
const notion = notionClient(token);

const entries = [];
for (const section of await notion.childPages(root)) {
  for (const page of await notion.childPages(section.id)) {
    entries.push({ id: page.id, section: section.title, path: join(out, section.title, entryFile(section.title, page.title)) });
  }
}

const files = await inBatches(entries, 3, async ({ id, section, path }) => {
  try {
    return { path, source: fromNotion(section, await notion.markdown(id)) };
  } catch (error) {
    throw new Error(`${path}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  }
});

for (const path of globSync(`${out}/**/*.md`)) rmSync(path);
for (const { path, source } of files) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, source);
}
console.log(`Imported ${String(files.length)} files from Notion into ${out}/`);
