# Maintaining the learning library

This guide explains how to add a lesson to an existing course and how to add a
new course.

Astro publishes a reviewed copy of the authoring content. A private authoring
source remains canonical. Do not edit both locations as a two-way sync. Adapt
the source manually, review the public copy, and record its origin in
`authoringSource`.

## Adding a lesson to an existing course

1. Adapt the lesson from the canonical authoring source. Keep private notes,
   learning records, ZIP exports, and historical material out of `src/`.
2. Add the public lesson to `src/content/lessons/`. Use a lower-case slug with
   letters, numbers, and single hyphens. Do not use the reserved segments
   `glossary`, `index`, or `resources`.
3. Add a matching entry to the course's `plannedLessons` array in
   `src/content/courses/<course-slug>.md`.
4. Keep these values the same in the lesson and its course summary: `course`,
   `slug`, `lessonNumber`, `title`, `description`, `durationMinutes`,
   `difficulty`, `topics`, and `status`.
5. Add the lesson's `objectives`, `prerequisites`, `publicationDate`,
   `updatedDate`, learner-facing `learnerSources`, AI disclosure, and a
   non-rendered `authoringSource` record.
6. Keep the lesson structure clear. Explain the idea before the examples. Add
   pitfalls, exercises, retrieval prompts, quizzes, demos, and further reading
   when they help. Label network-dependent examples. Keep runnable demos
   offline-safe.
7. Use course-relative links for references. From a lesson, link to
   `../glossary/` and `../resources/`. Do not copy absolute local paths or
   private source references into the lesson body.
8. Set the lesson summary to `published` only when the public lesson exists and
   passes review. Planned summaries do not get lesson pages.

A lesson's `authoringSource` records its origin without becoming a citation for
learners:

```yaml
authoringSource:
  course: dependency-injection-swe
  document: lessons/0002-depend-on-the-abstraction.html
  importedAt: 2026-08-27
```

The document path must be relative. It must not contain an absolute path, `..`,
`NOTES.md`, `notes`, `learning-records`, or another private record.

## Adding a new course

1. Add `src/content/courses/<course-slug>.md`.
2. Use a safe course slug. It must be lower-case and contain only letters,
   numbers, and single hyphens. The reserved route segments are not allowed.
3. Define the course title, description, status, difficulty, duration, topics,
   objectives, prerequisites, publication and update dates, learner sources, AI
   disclosure, pilot scope, authoring provenance, and ordered `plannedLessons`.
4. Add each public lesson to `src/content/lessons/` with the same course slug.
   A lesson is identified by `(course, slug)`. The same lesson slug can appear
   in different courses, but not twice in one course.
5. Add optional course references under
   `src/content/course-references/<course-slug>/`:
   - `glossary.md` creates `/courses/<course-slug>/glossary/`.
   - `further-reading.md` creates `/courses/<course-slug>/resources/`.
6. Set `kind: glossary` or `kind: further-reading` and use the same course slug
   in each reference. If a reference entry is absent, the site does not render
   a link to it.
7. Keep the course separate from the blog. Do not add lessons to
   `src/content/blog/` or to `src/pages/rss.xml.js`.
8. Mark the course `published` only after its public content, rights review,
   accessibility review, and preview review are complete. Use `pilot` while
   the course is still limited or under review.

## Metadata and content rules

- `learnerSources` contains public citations and further reading. It is not an
  authoring provenance field.
- `authoringSource` records the canonical course, a source-relative document,
  and the import date. It is metadata only and is not rendered for learners.
- Use `Beginner`, `Intermediate`, or `Advanced` for difficulty.
- Keep lesson order explicit with positive, unique `lessonNumber` values.
- A published lesson must have a matching published entry in its course's
  `plannedLessons` array. The build rejects mismatches and duplicates.
- Keep private notes, learning records, absolute local paths, ZIP exports, and
  historical `x01` material out of public content.
- Do not add lesson-specific analytics, accounts, server progress, or backend
  endpoints for demos without a separate design decision.

## Checks before publishing

Run these commands from the project root:

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm build
```

Then review the rendered routes in the Netlify Deploy Preview or a local
production preview. Check:

- course and lesson links, glossary, further reading, and previous/next links;
- difficulty and topic filters;
- quiz feedback and retry behavior;
- retrieval prompt disclosures;
- offline demos and labels for network-dependent examples;
- keyboard operation and visible focus;
- mobile layout, readable code, reduced motion, and print output;
- source links, AI disclosure, and feedback link;
- absence of authoring provenance and private paths from generated HTML;
- absence of lessons from the blog index, blog filters, and RSS output.

Before public release, complete the rights and attribution review for prose, code
examples, and third-party material. Keep the course or lesson in review until
that review and the preview check are complete.

## Deployment settings

Netlify settings are defined in `netlify.toml`. The build uses Node.js
`24.19.0`, pnpm `11.24.0`, `pnpm build`, and the `dist` publish directory. See
the deployment section in the root `README.md` for the current settings.
