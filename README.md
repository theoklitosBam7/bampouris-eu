# bampouris-eu

This repository contains the source for [bampouris.eu](https://www.bampouris.eu/).
It is a portfolio and blog built with [Astro](https://astro.build/), TypeScript,
Tailwind CSS, MDX, and Astro content collections.

## Features

### Design and UX

- Gradient hero with badges and a scroll indicator
- Skills marquee for the technology list
- Card-based layout for skills and expertise
- Scroll reveals, hover states, and small interface transitions
- Automatic dark mode based on the user's system setting
- Responsive layouts for mobile and desktop

### Technical features

- Astro 7 generates static pages with zero client JavaScript by default
- Tailwind CSS v4 through the Vite plugin
- TypeScript across components and content collections
- MDX support for content that needs components
- Sitemap, RSS feed, Open Graph, and canonical metadata
- Image optimization through Astro

### Content

- Markdown blog posts with frontmatter, tags, and syntax highlighting
- Learning library with courses, lessons, glossaries, and further reading
- Portfolio section with featured projects
- Homepage section with the latest blog posts

## Project structure

```text
├── public/
│   ├── blog-placeholder-*.jpg      # Blog post thumbnails
│   ├── favicon.svg                 # Site favicon
│   └── avatar-anime-1.jpg          # Profile image
├── docs/
│   └── lessons.md                   # Learning library maintenance guide
├── src/
│   ├── assets/fonts/                 # Bundled site fonts
│   ├── components/
│   │   ├── home/
│   │   │   ├── Hero.astro             # Hero section
│   │   │   ├── FeaturedProjects.astro # Portfolio showcase
│   │   │   ├── LatestPosts.astro      # Blog listing
│   │   │   └── SkillsMarquee.astro    # Technology list
│   │   ├── lessons/
│   │   │   ├── LessonFilters.astro    # Difficulty and topic filters
│   │   │   └── SourceList.astro       # Learner-facing source links
│   │   ├── ui/
│   │   │   ├── Button.astro           # Reusable button
│   │   │   ├── Card.astro             # Card container
│   │   │   └── Tag.astro              # Badge component
│   │   ├── BaseHead.astro             # Head metadata
│   │   ├── Footer.astro               # Site footer
│   │   ├── FormattedDate.astro        # Date formatting
│   │   ├── Header.astro               # Navigation header
│   │   └── RelatedLinks.astro         # Related blog and lesson links
│   ├── consts.ts                       # Site constants
│   ├── content.config.ts              # Content collection schemas
│   ├── content/
│   │   ├── blog/                      # Markdown blog posts
│   │   ├── courses/                   # Course metadata and lesson order
│   │   ├── course-references/         # Glossaries and further reading
│   │   └── lessons/                   # Public lesson content
│   ├── layouts/
│   │   ├── BlogPost.astro             # Blog post layout
│   │   ├── LessonPage.astro           # Lesson layout and interactions
│   │   └── LessonReferencePage.astro  # Glossary and resource layout
│   ├── pages/
│   │   ├── index.astro                # Homepage
│   │   ├── blog/                       # Blog routes
│   │   └── courses/                   # Learning library routes
│   ├── rss.xml.js                     # Blog RSS feed
│   ├── env.d.ts                        # Astro type declarations
│   ├── scripts/lessons/               # Quiz and demo browser scripts
│   ├── styles/                        # Global styles and animations
│   └── utils/                         # Route and lesson helpers
├── .node-version                      # Local and Netlify Node.js version
├── astro.config.ts                    # Astro configuration
├── netlify.toml                       # Netlify build configuration
├── package.json                       # Dependencies and scripts
├── pnpm-lock.yaml                     # Locked dependency versions
├── pnpm-workspace.yaml                # pnpm settings
├── prettier.config.mjs                # Prettier configuration
├── tsconfig.json                      # TypeScript configuration
└── LICENSE                            # Project license
```

### Component architecture

- `src/components/home/` contains homepage sections.
- `src/components/ui/` contains shared UI components.
- Components use scoped styles where possible.
- CSS custom properties hold the shared design tokens.

## Getting started

Use Node.js `24.19.0` and pnpm `11.24.0`. The repository pins both versions
for local work and Netlify builds.

1. Install dependencies:

   ```sh
   pnpm install --frozen-lockfile
   ```

2. Start the development server:

   ```sh
   pnpm dev
   ```

   Open [localhost:4321](http://localhost:4321) in a browser.

3. Build for production:

   ```sh
   pnpm build
   ```

4. Preview the production build:

   ```sh
   pnpm preview
   ```

### Netlify deployment

Netlify uses the settings in `netlify.toml`:

- Node.js `24.19.0`, which satisfies the project minimum of `>=22.12.0`.
- pnpm `11.24.0`, pinned by the `packageManager` field in `package.json`.
- Build command `pnpm build`.
- Publish directory `dist`.

The build produces static files. After the repository is connected to Netlify,
pull requests can use Deploy Previews. Review the pilot routes in the preview
before merging. Complete the lesson rights and attribution review before
public release.

For the workflow for adding lessons and courses, see
[Maintaining the learning library](./docs/lessons.md).

The learning library is separate from the blog. Add courses, lessons, glossaries,
and further reading under `src/content/`; do not add lessons to the blog or its
RSS feed.

## Content management

### Blog posts

Add Markdown files to `src/content/blog/` to create blog posts. Each post
supports frontmatter:

```yaml
---
title: "Post Title"
description: "A brief description"
date: 2025-01-01
tags: ["astro", "tailwind", "webdev"]
draft: false
---
# Your content here
```

### Learning library

Add course metadata to `src/content/courses/`, public lessons to
`src/content/lessons/`, and optional glossaries or further reading to
`src/content/course-references/`. The library is published under `/courses/` and
does not add lessons to the blog or its RSS feed. See
[Maintaining the learning library](./docs/lessons.md) before adding content.

### Featured projects

Projects are stored in `src/components/home/FeaturedProjects.astro`. Edit its
`projects` array to change the portfolio.

### Skills and technologies

The technology list is stored in `src/components/home/SkillsMarquee.astro`.
Edit its `technologies` array to change the list.

## Scripts

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `pnpm install`   | Install dependencies                       |
| `pnpm dev`       | Start the development server               |
| `pnpm build`     | Type-check and build the site in `./dist/` |
| `pnpm preview`   | Preview the production build locally       |
| `pnpm astro ...` | Run an Astro CLI command                   |
| `pnpm lint`      | Format files and run ESLint                |

## Customization

### Styling

- Edit `src/styles/global.css` for design tokens and global styles.
- Edit `src/styles/animations.css` for animation rules.
- Tailwind CSS 4 uses the Vite plugin and CSS directives in component styles.

### Content collections

Edit `src/content.config.ts` to configure the content collections. Astro then
provides typed access to the Markdown content.

## Tech stack

| Technology                                    | Purpose                  |
| --------------------------------------------- | ------------------------ |
| [Astro 7](https://astro.build/)               | Static site generation   |
| [Tailwind CSS v4](https://tailwindcss.com/)   | Utility-first CSS        |
| [TypeScript](https://www.typescriptlang.org/) | Type safety              |
| [MDX](https://mdxjs.com/)                     | Markdown with components |
| [ESLint](https://eslint.org/)                 | Code linting             |
| [Prettier](https://prettier.io/)              | Code formatting          |
| [pnpm](https://pnpm.io/)                      | Package management       |

## Browser support

The site supports current evergreen browsers:

- Chrome and Edge, last two versions
- Firefox, last two versions
- Safari, last two versions
- Mobile Safari and Chrome Mobile

## License

[MIT](./LICENSE) License (c) 2026
[Theoklitos Bampouris](https://github.com/theoklitosBam7)
