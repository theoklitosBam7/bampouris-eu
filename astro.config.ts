import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://www.bampouris.eu",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
  },
});
