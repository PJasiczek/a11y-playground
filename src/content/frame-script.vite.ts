import type { Plugin } from "vite";

/**
 * Bundles a script that runs inside sandboxed demo frames, with its dependencies, into one
 * classic script exposed as the global `name`, and serves its source as the virtual module `id`.
 * A sandboxed frame has an opaque origin, so it could not load a module script from this server;
 * the demo documents inline this string instead.
 */
export function frameScriptPlugin({ id, entry, name }: { id: `virtual:${string}`; entry: string; name: string }): Plugin {
  const resolvedId = `\0${id}`;
  return {
    name: `a11y-frame-script-${name}`,
    resolveId: (source) => (source === id ? resolvedId : undefined),
    async load(resolved) {
      if (resolved !== resolvedId) return;
      const { build } = await import("vite");
      const output = await build({
        configFile: false,
        logLevel: "silent",
        build: {
          write: false,
          minify: true,
          lib: { entry, formats: ["iife"], name },
        },
      });
      const outputs = Array.isArray(output) ? output : [output];
      const chunk = outputs.flatMap((o) => ("output" in o ? o.output : [])).find((file) => file.type === "chunk");
      if (!chunk) throw new Error(`${id}: the bundle has no script`);
      for (const file of chunk.moduleIds) if (!file.includes("node_modules")) this.addWatchFile(file);
      return `export default ${JSON.stringify(chunk.code)};`;
    },
  };
}
