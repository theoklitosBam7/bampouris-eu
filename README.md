# bampouris-eu

This is the source code for [bampouris.eu](https://bampouris.eu), a personal portfolio and blog site built with [Astro](https://astro.build/), TypeScript, and modern web technologies.

## ✨ Features

- Fast, SEO-friendly static site built with Astro
- Blog posts written in Markdown
- Portfolio section for featured projects
- Responsive design and minimal custom styling
- RSS feed and sitemap support
- OpenGraph and canonical meta tags
- Custom components for layout, tech stack, and more

## 🗂️ Project Structure

```text
├── public/
│   ├── blog-placeholder-*.jpg
│   ├── favicon.svg
│   ├── theoklitos-avatar-1.jpg
│   ├── fonts/
│   └── logos/
├── src/
│   ├── consts.ts
│   ├── env.d.ts
│   ├── components/
│   ├── content/
│   │   ├── config.ts
│   │   └── blog/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── astro.config.ts
├── eslint.config.js
├── prettier.config.mjs
├── package.json
├── tsconfig.json
├── LICENSE
├── README.md
```

### Key Directories

- `public/`: Static assets (images, fonts, logos)
- `src/components/`: Astro components for UI and layout
- `src/content/blog/`: Markdown blog posts
- `src/layouts/`: Layout components for pages and posts
- `src/pages/`: Site pages and routing
- `src/styles/`: Global CSS
- `src/utils/`: Utility functions

## 🚀 Getting Started

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Start the development server**

   ```sh
   npm run dev
   ```

   Visit [localhost:4321](http://localhost:4321) in your browser.

3. **Build for production**

   ```sh
   npm run build
   ```

4. **Preview the build**

   ```sh
   npm run preview
   ```

## 📝 Blog Posts

Add Markdown files to `src/content/blog/` to create new posts. Each post supports frontmatter for title, date, description, and tags.

## 🧩 Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm install`       | Install dependencies                     |
| `npm run dev`       | Start local dev server                   |
| `npm run build`     | Build site to `./dist/`                  |
| `npm run preview`   | Preview production build locally         |
| `npm run astro ...` | Run Astro CLI commands                   |
| `npm run lint`      | Run ESLint and Prettier for code quality |

## 🛠️ Tech Stack

- [Astro](https://astro.build/)
- [TypeScript](https://www.typescriptlang.org/)
- [Markdown](https://www.markdownguide.org/)
- [Prettier](https://prettier.io/) & [ESLint](https://eslint.org/)

## 📄 License

[MIT](./LICENSE) License © 2025 [Theoklitos Bampouris](https://github.com/theoklitosBam7)
