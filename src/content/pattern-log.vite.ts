import type { Plugin } from "vite";

const id = "virtual:pattern-log";
const entry = "src/content/pattern-log.entry.ts";

/**
 * Bundles the live log of pattern frames, with dom-accessibility-api, into one classic script and
 * serves its source as `virtual:pattern-log`. A sandboxed frame has an opaque origin, so it could
 * not load a module script from this server; patternDocument inlines this string instead.
 */
export function patternLogPlugin(): Plugin {
  return {
    name: "a11y-pattern-log",
    resolveId: (source) => (source === id ? `\0${id}` : undefined),
    async load(resolved) {
      if (resolved !== `\0${id}`) return;
      const { build } = await import("vite");
      const output = await build({
        configFile: false,
        logLevel: "silent",
        build: {
          write: false,
          minify: true,
          lib: { entry, formats: ["iife"], name: "a11yPatternLog" },
        },
      });
      const outputs = Array.isArray(output) ? output : [output];
      const chunk = outputs.flatMap((o) => ("output" in o ? o.output : [])).find((file) => file.type === "chunk");
      if (!chunk) throw new Error("pattern log: the bundle has no script");
      for (const file of chunk.moduleIds) if (!file.includes("node_modules")) this.addWatchFile(file);
      return `export default ${JSON.stringify(chunk.code)};`;
    },
  };
}
