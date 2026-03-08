# bampouris-eu

This is the source code for [bampouris.eu](https://bampouris.eu) — a modern personal portfolio and blog site built with [Astro](https://astro.build/), [Tailwind CSS](https://tailwindcss.com/), TypeScript, and contemporary web technologies.

## ✨ Features

### Design & UX

- **Modern Hero Section** — Animated gradient orbs, floating badges, and scroll indicators
- **Skills Marquee** — Infinite scrolling animation showcasing tech stack
- **Bento Grid Layout** — Contemporary card-based design for skills/expertise
- **Smooth Animations** — Scroll-triggered reveals, hover effects, and micro-interactions
- **Dark Mode Support** — Automatic theme detection with CSS custom properties
- **Fully Responsive** — Mobile-first approach with breakpoints for all screen sizes

### Technical Features

- **Astro 5** — Lightning-fast static site generation with zero JS by default
- **Tailwind CSS v4** — Utility-first styling with Vite integration
- **TypeScript** — Full type safety across components and content collections
- **MDX Support** — Enhanced Markdown with interactive component support
- **SEO Optimized** — Sitemap, RSS feed, OpenGraph, and canonical meta tags
- **Image Optimization** — Automatic image optimization with Astro's Image component

### Content

- **Blog System** — Markdown-based posts with frontmatter, tags, and syntax highlighting
- **Portfolio Section** — Featured projects with descriptions and links
- **Latest Posts Display** — Dynamic homepage listing recent blog entries

## 🗂️ Project Structure

```text
├── public/
│   ├── blog-placeholder-*.jpg      # Blog post thumbnails
│   ├── favicon.svg                 # Site favicon
│   └── theoklitos-avatar-1.jpg     # Profile image
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   ├── Hero.astro           # Hero section with animations
│   │   │   ├── FeaturedProjects.astro # Portfolio showcase
│   │   │   ├── LatestPosts.astro    # Blog listing
│   │   │   └── SkillsMarquee.astro  # Tech stack marquee
│   │   ├── ui/
│   │   │   ├── Button.astro         # Reusable button component
│   │   │   ├── Card.astro           # Card container component
│   │   │   └── Tag.astro            # Tag/badge component
│   │   ├── BaseHead.astro           # Head metadata
│   │   ├── Footer.astro             # Site footer
│   │   ├── FormattedDate.astro      # Date formatting
│   │   └── Header.astro             # Navigation header
│   ├── content/
│   │   ├── config.ts                # Content collection config
│   │   └── blog/                    # Markdown blog posts
│   ├── layouts/
│   │   ├── BlogPost.astro           # Blog post layout
│   │   └── Layout.astro             # Base layout
│   ├── pages/
│   │   ├── index.astro              # Homepage
│   │   └── blog/
│   │       └── index.astro          # Blog listing page
│   └── styles/
│       ├── animations.css           # Scroll & hover animations
│       └── global.css               # Global styles & variables
├── astro.config.ts                  # Astro configuration
├── eslint.config.js                 # ESLint rules
├── prettier.config.mjs              # Prettier config
├── tsconfig.json                    # TypeScript config
└── package.json                     # Dependencies & scripts
```

### Component Architecture

- **`src/components/home/`** — Homepage-specific sections with individual styling
- **`src/components/ui/`** — Reusable UI components with consistent design tokens
- **Scoped Styles** — Each component includes its own styles for maintainability
- **Design Tokens** — CSS custom properties for colors, spacing, and typography

## 🚀 Getting Started

1. **Install dependencies**

   ```sh
   pnpm install
   ```

2. **Start the development server**

   ```sh
   pnpm dev
   ```

   Visit [localhost:4321](http://localhost:4321) in your browser.

3. **Build for production**

   ```sh
   pnpm build
   ```

4. **Preview the production build**

   ```sh
   pnpm preview
   ```

## 📝 Content Management

### Blog Posts

Add Markdown files to `src/content/blog/` to create new posts. Each post supports frontmatter:

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

### Featured Projects

Projects are managed in `src/components/home/FeaturedProjects.astro` — edit the `projects` array to update the portfolio section.

### Skills & Technologies

The tech stack is configured in `src/components/home/SkillsMarquee.astro` — add or remove items from the `technologies` array.

## 🧩 Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `pnpm install`   | Install dependencies                     |
| `pnpm dev`       | Start local dev server                   |
| `pnpm build`     | Build site to `./dist/` with type check  |
| `pnpm preview`   | Preview production build locally         |
| `pnpm astro ...` | Run Astro CLI commands                   |
| `pnpm lint`      | Run ESLint and Prettier for code quality |

## 🎨 Customization

### Styling

- **Global Styles** — Edit `src/styles/global.css` for design tokens
- **Animations** — Modify `src/styles/animations.css` for effects
- **Tailwind CSS** — Using v4 with Vite plugin. Configuration via CSS variables and `@import "tailwindcss"` directives in component styles

### Content Collections

Configure content schemas in `src/content/config.ts` — Astro provides type-safe access to your Markdown frontmatter.

## 🛠️ Tech Stack

| Technology                                    | Purpose                                        |
| --------------------------------------------- | ---------------------------------------------- |
| [Astro 5](https://astro.build/)               | Static site generator with island architecture |
| [Tailwind CSS v4](https://tailwindcss.com/)   | Utility-first styling framework                |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript                           |
| [MDX](https://mdxjs.com/)                     | Enhanced Markdown with JSX support             |
| [ESLint](https://eslint.org/)                 | Code linting and quality                       |
| [Prettier](https://prettier.io/)              | Code formatting                                |
| [pnpm](https://pnpm.io/)                      | Fast, disk-efficient package manager           |

## 🌐 Browser Support

This site supports modern evergreen browsers:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

[MIT](./LICENSE) License © 2026 [Theoklitos Bampouris](https://github.com/theoklitosBam7)
