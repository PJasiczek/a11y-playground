/**
 * Shared pieces of the Notion seed and import scripts.
 *
 * Layout in Notion: under the root page (NOTION_ROOT_PAGE_ID) one page per folder of content/
 * ("kryteria", "slownik", …), and under each of them one page per Markdown file. A page holds
 * the file's frontmatter in a YAML code block at the top and the Markdown body below it.
 * Quizzes (*.quiz.yaml) and the HTML demos stay in the repository.
 */
import { type } from "arktype";
import { siteUrl } from "../src/lib/site.ts";

/** Sections whose entries are folders: "okno-dialogowe" is okno-dialogowe/index.md. */
const folderSections = new Set(["praktyka", "wzorce", "sciezki"]);

/** The Notion title of a file, from its path inside the section folder ("programista/index.md"). */
export function entryTitle(section: string, file: string) {
  const name = file.replace(/\.md$/, "");
  return folderSections.has(section) ? name.replace(/\/index$/, "") : name;
}

/** The path of a file inside its section folder, from its Notion title. The reverse of entryTitle. */
export function entryFile(section: string, title: string) {
  if (!/^[a-z0-9.-]+(\/[a-z0-9.-]+)?$/.test(title)) throw new Error(`${section}: "${title}" is not a valid entry title`);
  return folderSections.has(section) && !title.includes("/") ? `${title}/index.md` : `${title}.md`;
}

/*
 * Notion rewrites some Markdown on the way in or out, so the two functions below translate:
 * - links: Notion drops addresses that are not URLs and points relative ones at notion.com, so
 *   glossary marks (slownik:x), law marks (prawo:x) and relative links travel as links to the live
 *   site, which also keeps them clickable while editing. Glossary entries link to each other with
 *   relative links and use no marks, which tells the two apart on the way back;
 * - code blocks: Notion only keeps languages it knows, so the ```przed and ```po blocks of the
 *   before and after problems travel as ```html with a first line naming the block;
 * - inline formatting: Notion returns some inline code and bold as <code> and <b>, escapes
 *   square brackets, and turns text that looks like a domain or an e-mail address into a link.
 */
const namedBlock = /^```(przed|po)\n/gm;
const namedBlockBack = /^```[a-z ]*\n<!-- (przed|po) -->\n/gm;
// Fenced code blocks, which the inline translations must leave alone.
const fence = /^```[\s\S]*?^```[ \t]*$/m;

/** Applies `edit` to the parts of `body` outside fenced code blocks. */
function outsideCode(body: string, edit: (text: string) => string) {
  const parts = body.split(new RegExp(`(${fence.source})`, "m"));
  return parts.map((part, i) => (i % 2 === 1 ? part : edit(part))).join("");
}

/** A content file as the Markdown of its Notion page. */
export function toNotion(source: string) {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(source.replace(/\r\n/g, "\n"));
  if (!match) throw new Error("missing frontmatter between --- lines");
  const [, yaml = "", body = ""] = match;
  const notionBody = outsideCode(body, (text) =>
    text.replaceAll("](slownik:", `](${siteUrl}/slownik#`).replaceAll("](prawo:", `](${siteUrl}/prawo/`).replaceAll("](/", `](${siteUrl}/`),
  ).replace(namedBlock, "```html\n<!-- $1 -->\n");
  return `\`\`\`yaml\n${yaml}\n\`\`\`\n${notionBody}`;
}

/** The Markdown of a Notion page in `section` as a content file. The reverse of toNotion. */
export function fromNotion(section: string, markdown: string) {
  const match = /^```yaml\n([\s\S]*?)\n```(?:\n+|$)([\s\S]*)$/.exec(markdown.replace(/\r\n/g, "\n"));
  if (!match) throw new Error("the page must start with a yaml code block");
  const [, yaml = "", body = ""] = match;
  const marks = section !== "slownik";
  const fileBody = outsideCode(body, (text) =>
    text
      .replace(/<code>(.*?)<\/code>/g, (_, code: string) => (code.includes("`") ? `\`\` ${code} \`\`` : `\`${code}\``))
      .replace(/<b>(.*?)<\/b>/g, "**$1**")
      .replace(/\\([[\]])/g, "$1")
      .replace(/\[([^\]]+)\]\((?:https?:\/\/|mailto:)\1\)/g, "$1")
      .replaceAll(`](${siteUrl}/slownik#`, marks ? "](slownik:" : "](/slownik#")
      .replaceAll(`](${siteUrl}/prawo/`, marks ? "](prawo:" : "](/prawo/")
      .replaceAll(`](${siteUrl}/`, "](/"),
  ).replace(namedBlockBack, "```$1\n");
  const text = fileBody.trimEnd();
  return `---\n${yaml}\n---\n${text ? `\n${text}\n` : ""}`;
}

/** NOTION_TOKEN and NOTION_ROOT_PAGE_ID, from the environment or .env.local. */
export function notionEnv() {
  const token = process.env.NOTION_TOKEN;
  const root = process.env.NOTION_ROOT_PAGE_ID;
  if (!token || !root) throw new Error("Set NOTION_TOKEN and NOTION_ROOT_PAGE_ID (locally in .env.local)");
  return { token, root };
}

const ChildPages = type({
  results: type({ id: "string", type: "string", "child_page?": { title: "string" } }).array(),
  next_cursor: "string | null",
});
const PageMarkdown = type({ markdown: "string", truncated: "boolean" });
const Created = type({ id: "string" });

/** A small Notion client: retries on rate limits and server errors, fails loudly otherwise. */
export function notionClient(token: string) {
  async function call(method: string, path: string, body?: object): Promise<unknown> {
    for (let attempt = 1; ; attempt++) {
      const response = await fetch(`https://api.notion.com/v1${path}`, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2026-03-11", "Content-Type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (response.ok) return response.json();
      const retry = response.status === 429 || response.status >= 500;
      if (!retry || attempt === 5) throw new Error(`${method} ${path}: HTTP ${String(response.status)} ${await response.text()}`);
      const wait = Number(response.headers.get("retry-after") ?? attempt);
      await new Promise((resolve) => setTimeout(resolve, wait * 1000));
    }
  }

  return {
    /** Child pages of a page, in Notion order. */
    async childPages(pageId: string) {
      const pages: { id: string; title: string }[] = [];
      let cursor: string | null = null;
      do {
        const query: string = cursor ? `&start_cursor=${cursor}` : "";
        const data = ChildPages.assert(await call("GET", `/blocks/${pageId}/children?page_size=100${query}`));
        for (const block of data.results) if (block.child_page) pages.push({ id: block.id, title: block.child_page.title });
        cursor = data.next_cursor;
      } while (cursor);
      return pages;
    },

    /** A page's content as Notion-flavored Markdown (v2, which keeps blank lines). */
    async markdown(pageId: string) {
      const page = PageMarkdown.assert(await call("GET", `/pages/${pageId}/markdown?markdown_version=v2`));
      if (page.truncated) throw new Error(`page ${pageId} is too large for one request`);
      return page.markdown;
    },

    /** Creates a page under `parentId`, optionally with Markdown content, and returns its id. */
    async createPage(parentId: string, title: string, markdown?: string) {
      const page = Created.assert(
        await call("POST", "/pages", {
          parent: { page_id: parentId },
          properties: { title: { title: [{ text: { content: title } }] } },
          ...(markdown === undefined ? {} : { markdown, markdown_version: "v2" }),
        }),
      );
      return page.id;
    },
  };
}

/** Runs `task` over `items` with at most `limit` in flight, keeping Notion's rate limit in sight. */
export async function inBatches<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>) {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) results.push(...(await Promise.all(items.slice(i, i + limit).map(task))));
  return results;
}
