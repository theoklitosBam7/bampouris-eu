import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { isSafeRouteSegment } from "@/utils/route-segments";

const difficultySchema = z.enum(["Advanced", "Beginner", "Intermediate"]);
const lessonStatusSchema = z.enum(["planned", "published"]);
const courseStatusSchema = z.enum(["pilot", "published"]);
const courseReferenceKindSchema = z.enum(["glossary", "further-reading"]);
const routeSegmentSchema = z.string().refine(isSafeRouteSegment, {
  message:
    "Use a lower-case route segment with letters, numbers, and single hyphens. Reserved route segments are not allowed.",
});

const sourceLinkSchema = z.object({
  href: z
    .url()
    .refine(
      (href) => ["http:", "https:"].includes(new URL(href).protocol),
      "Learner-facing links must use HTTP or HTTPS.",
    ),
  label: z.string(),
});

const sourceDocumentSchema = z
  .string()
  .min(1)
  .refine((document) => {
    const normalizedDocument = document.replaceAll("\\", "/");
    const segments = normalizedDocument.split("/");

    return (
      !normalizedDocument.startsWith("/") &&
      !/^[A-Za-z]:\//.test(normalizedDocument) &&
      !segments.includes("..") &&
      !segments.some((segment) =>
        /^(?:notes(?:\.md)?|learning-records?)$/i.test(segment),
      )
    );
  }, "Authoring source documents must be relative public-source paths, not private records or absolute paths.");

const sourceTraceabilitySchema = z.object({
  course: z.string(),
  document: sourceDocumentSchema,
  importedAt: z.coerce.date(),
});

const lessonSummarySchema = z.object({
  description: z.string(),
  difficulty: difficultySchema,
  durationMinutes: z.number().int().positive(),
  lessonNumber: z.number().int().positive(),
  slug: routeSegmentSchema,
  status: lessonStatusSchema,
  title: z.string(),
  topics: z.array(z.string()).min(1),
});

const lessonMetadataSchema = z.object({
  aiAssistanceDisclosure: z.string(),
  course: routeSegmentSchema,
  description: z.string(),
  difficulty: difficultySchema,
  durationMinutes: z.number().int().positive(),
  lessonNumber: z.number().int().positive(),
  slug: routeSegmentSchema,
  objectives: z.array(z.string()).min(1),
  prerequisites: z.array(z.string()),
  publicationDate: z.coerce.date(),
  learnerSources: z.array(sourceLinkSchema).min(1),
  authoringSource: sourceTraceabilitySchema,
  status: lessonStatusSchema,
  title: z.string(),
  topics: z.array(z.string()).min(1),
  updatedDate: z.coerce.date(),
});

const courseSchema = z.object({
  aiAssistanceDisclosure: z.string(),
  description: z.string(),
  difficulty: difficultySchema,
  durationMinutes: z.number().int().positive(),
  objectives: z.array(z.string()).min(1),
  pilotScope: z.object({
    excluded: z.array(z.string()).min(1),
    included: z.array(z.string()).min(1),
  }),
  plannedLessons: z.array(lessonSummarySchema).min(1),
  prerequisites: z.array(z.string()),
  publicationDate: z.coerce.date(),
  slug: routeSegmentSchema,
  authoringSource: sourceTraceabilitySchema,
  learnerSources: z.array(sourceLinkSchema).min(1),
  status: courseStatusSchema,
  title: z.string(),
  topics: z.array(z.string()).min(1),
  updatedDate: z.coerce.date(),
});

const courseReferenceSchema = z.object({
  course: routeSegmentSchema,
  description: z.string(),
  eyebrow: z.string(),
  kind: courseReferenceKindSchema,
  title: z.string(),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      relatedLessons: z
        .array(
          z.object({
            course: routeSegmentSchema,
            slug: routeSegmentSchema,
          }),
        )
        .optional(),
      tags: z.array(z.string()).optional(),
    }),
});

const courses = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/courses" }),
  schema: courseSchema,
});

const lessons = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/lessons",
    generateId: ({ entry }) => entry,
  }),
  schema: lessonMetadataSchema,
});

const courseReferences = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/course-references",
  }),
  schema: courseReferenceSchema,
});

export const collections = { blog, courses, lessons, courseReferences };
