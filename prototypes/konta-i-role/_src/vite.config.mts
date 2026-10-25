import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/postcss";

// Classic script instead of an ES module: browsers refuse module scripts on file://,
// and the prototype must open from a double click as well as from any static server.
function classicScript(): Plugin {
  return {
    name: "classic-script",
    enforce: "post",
    transformIndexHtml(html) {
      return html
        .replace(/<script type="module" crossorigin/g, "<script defer")
        .replace(/<link rel="stylesheet" crossorigin/g, '<link rel="stylesheet"');
    },
  };
}

export default defineConfig({
  root: __dirname,
  base: "./",
  plugins: [classicScript()],
  oxc: { jsx: { runtime: "automatic" } },
  css: { postcss: { plugins: [tailwindcss()] } },
  build: {
    // The build output sits next to the sources, so the root folder is the deployable prototype.
    outDir: "..",
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "assets/app.js",
        assetFileNames: "assets/app[extname]",
      },
    },
  },
});
