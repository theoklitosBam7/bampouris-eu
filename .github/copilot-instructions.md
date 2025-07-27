# Copilot Instructions for bampouris-eu

This project is a personal portfolio and blog site built with Astro, TypeScript, and Markdown. It is statically generated and uses custom components, layouts, and utility scripts. Follow these guidelines to be productive as an AI coding agent in this codebase.

## Architecture Overview

- **Astro-based static site**: All routing and page generation is handled by Astro. Pages are in `src/pages/`, layouts in `src/layouts/`, and UI components in `src/components/`.
- **Blog posts**: Authored in Markdown (`src/content/blog/`). Metadata is validated via a schema in `src/content/config.ts`.
- **Global styles**: CSS is in `src/styles/global.css`, using Tailwind via `@import`. Custom fonts are loaded from `public/fonts/`.
- **Featured projects and GitHub stats**: Fetched at build time using utility functions in `src/utils/github.ts`, with caching for API efficiency.
- **Main entry points**: `src/pages/index.astro` (home), `src/pages/blog/index.astro` (blog listing), and `src/pages/blog/[...slug].astro` (individual posts).

## Developer Workflows

- **Install dependencies**: `npm install`
- **Start dev server**: `npm run dev` (default port 4321)
- **Build for production**: `npm run build`
- **Preview build**: `npm run preview`
- **Lint and format**: `npm run lint` (uses Prettier and ESLint)
- **Pre-commit hooks**: Enforced via `simple-git-hooks` and `lint-staged` (see `package.json`).

## Project-Specific Patterns

- **Component usage**: All pages import `global.css` via the `BaseHead.astro` component for consistent styling.
- **Blog post schema**: Frontmatter for posts must include `title`, `description`, and `pubDate`; `updatedDate` and `heroImage` are optional.
- **Featured projects**: Defined in `src/utils/github.ts` by repo name; update the `featuredRepoNames` array to change featured projects.
- **Caching**: GitHub API responses are cached to `.github-cache.json` during build for performance and API limits.
- **Responsive design**: Custom CSS and Tailwind classes are used; see `global.css` and inline styles in page/layout files.

## Integration Points

- **Astro integrations**: Configured in `astro.config.ts` (MDX, sitemap, Tailwind).
- **GitHub API**: Used for dynamic stats and project info; see `src/utils/github.ts`.
- **Markdown content**: All blog posts are Markdown files in `src/content/blog/` and validated via Zod schema in `src/content/config.ts`.

## Examples

- To add a new blog post: create a Markdown file in `src/content/blog/` with required frontmatter.
- To feature a new GitHub project: add its repo name to `featuredRepoNames` in `src/utils/github.ts`.
- To update global styles: edit `src/styles/global.css`.

## Key Files & Directories

- `src/pages/` — Astro pages and routing
- `src/layouts/` — Layouts for blog and other pages
- `src/components/` — Reusable UI components
- `src/content/blog/` — Markdown blog posts
- `src/utils/github.ts` — GitHub API integration and caching
- `src/styles/global.css` — Global and Tailwind-based styles
- `astro.config.ts` — Site and integration config
- `package.json` — Scripts, hooks, and dependencies

---

If any conventions or workflows are unclear, please ask for clarification or examples from the codebase.
