# Repository instructions

## Project

This repository contains the static [bampouris.eu](https://www.bampouris.eu) portfolio, blog, and learning library. It uses Astro 7, TypeScript, Tailwind CSS 4 through the Vite plugin, MDX, and the Astro content API.

Use Node.js `24.19.0` and pnpm `11.24.0`. Treat `.node-version`, `package.json`, `netlify.toml`, the Astro configuration, and the TypeScript configuration as the authoritative references for versions, commands, and tooling.

## Working workflow

1. Check `git status --short` before editing. Preserve unrelated user changes.
2. Read the relevant source files and follow their existing patterns before adding abstractions.
3. Make the smallest change that satisfies the request. Keep the static deployment model and avoid new dependencies unless the request requires them.
4. For lesson or course changes, read `docs/lessons.md` before editing. Treat public lesson content as a reviewed manual import from a private authoring source. Keep private source paths, notes, records, and historical exports out of public files.
5. Run the verification commands that match the changed files. Report any failure and its output.
6. Do not commit, push, or open a pull request unless the user explicitly requests that action.

## Existing architecture

- Content collections and their schemas are defined in `src/content.config.ts`.
- Blog posts live in `src/content/blog/` and are rendered through `src/pages/blog/` and `src/layouts/BlogPost.astro`.
- Courses, lessons, and course references live in `src/content/courses/`, `src/content/lessons/`, and `src/content/course-references/`. Their public routes live under `/courses/`.
- Shared site components live in `src/components/`; homepage sections live in `src/components/home/`; reusable UI primitives live in `src/components/ui/`.
- Lesson-specific components live in `src/components/lessons/`, lesson layouts live in `src/layouts/Lesson*.astro`, and quiz/demo behavior lives in `src/scripts/lessons/`.
- Keep the learning library separate from the blog and RSS feed. Do not add lesson content to `src/content/blog/` or `src/pages/rss.xml.js`.
- Global design tokens and styles are in `src/styles/global.css`; animation rules are in `src/styles/animations.css`.
- Use the `@/*` TypeScript path alias for imports from `src/`.
- Prefer Astro components and native browser scripts. Use scoped styles and the existing CSS custom properties instead of introducing a second styling system.
- Follow the repository formatter and ESLint rules, including sorted imports and declarations. Do not manually work around formatter output.

## Verification

- For TypeScript, Astro, content, or route changes, run `pnpm build`. This runs `astro check` and the production build.
- For code or Astro component changes, run `pnpm lint` when its write-based formatting and ESLint fixes are appropriate for the working tree.
- There is no tracked browser-test framework or test suite. For lesson changes, perform focused browser checks against the rendered routes and interactions: course and lesson links, glossary and sources, previous/next navigation, quiz feedback and retry, retrieval prompts, demonstrations, mobile layout, keyboard operation, visible focus, reduced motion, and print output.
- For lesson changes, confirm that optional course references do not produce broken links, and that the existing blog pages, blog filters, and RSS output remain unchanged unless the request explicitly changes them.
- For deployment changes, check `netlify.toml`, use `pnpm install --frozen-lockfile`, and review the Netlify Deploy Preview before release.
