import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const difficultySchema = z.enum(["Advanced", "Beginner", "Intermediate"]);
const lessonStatusSchema = z.enum(["planned", "published"]);
const courseStatusSchema = z.enum(["pilot", "published"]);

const sourceLinkSchema = z.object({
  href: z.url(),
  label: z.string(),
});

const sourceTraceabilitySchema = z.object({
  course: z.string(),
  document: z.string(),
  importedAt: z.coerce.date(),
});

const lessonSummarySchema = z.object({
  description: z.string(),
  difficulty: difficultySchema,
  durationMinutes: z.number().int().positive(),
  lessonNumber: z.number().int().positive(),
  slug: z.string().min(1),
  status: lessonStatusSchema,
  title: z.string(),
  topics: z.array(z.string()).min(1),
});

const lessonNavigationSchema = z.object({
  next: z.string().min(1).optional(),
  previous: z.string().min(1).optional(),
});

const lessonMetadataSchema = z.object({
  aiAssistanceDisclosure: z.string(),
  course: z.string(),
  description: z.string(),
  difficulty: difficultySchema,
  durationMinutes: z.number().int().positive(),
  lessonNumber: z.number().int().positive(),
  navigation: lessonNavigationSchema.optional(),
  slug: z.string().min(1),
  objectives: z.array(z.string()).min(1),
  prerequisites: z.array(z.string()),
  publicationDate: z.coerce.date().optional(),
  sources: z.array(sourceLinkSchema).min(1),
  authoringSource: sourceTraceabilitySchema,
  status: lessonStatusSchema,
  title: z.string(),
  topics: z.array(z.string()).min(1),
  updatedDate: z.coerce.date().optional(),
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
  slug: z.string().min(1),
  authoringSource: sourceTraceabilitySchema,
  sources: z.array(sourceLinkSchema).min(1),
  status: courseStatusSchema,
  title: z.string(),
  topics: z.array(z.string()).min(1),
  updatedDate: z.coerce.date(),
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
      relatedLessons: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
    }),
});

const courses = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/courses" }),
  schema: courseSchema,
});

const lessons = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/lessons" }),
  schema: lessonMetadataSchema,
});

export const collections = { blog, courses, lessons };
