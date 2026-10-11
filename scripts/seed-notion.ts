/**
 * Copies every Markdown file of content/ into Notion once, in the layout described in notion.ts.
 * Run by hand with `pnpm seed:notion`. Refuses to run when the root page already has child
 * pages, so it cannot duplicate the content.
 */
import { globSync, readFileSync } from "node:fs";
import { entryTitle, inBatches, notionClient, notionEnv, toNotion } from "./notion.ts";

const { token, root } = notionEnv();
const notion = notionClient(token);

if ((await notion.childPages(root)).length > 0) throw new Error("The root page already has child pages; seed only into an empty page");

const files = globSync("content/**/*.md").map((path) => path.replaceAll("\\", "/")).toSorted();
const sections = [...new Set(files.map((path) => path.split("/")[1] ?? ""))];

for (const section of sections) {
  const paths = files.filter((path) => path.startsWith(`content/${section}/`));
  const sectionId = await notion.createPage(root, section);
  await inBatches(paths, 3, (path) => {
    const file = path.slice(`content/${section}/`.length);
    return notion.createPage(sectionId, entryTitle(section, file), toNotion(readFileSync(path, "utf8")));
  });
  console.log(`${section}: ${String(paths.length)}`);
}
