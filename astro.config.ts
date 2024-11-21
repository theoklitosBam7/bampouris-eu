import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://www.bampouris.eu",
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
  },
});
