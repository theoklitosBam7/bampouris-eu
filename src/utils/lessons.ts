import type { CollectionEntry } from "astro:content";

import {
  getRouteSegmentError,
  isSafeRouteSegment,
} from "@/utils/route-segments";

type BlogPost = CollectionEntry<"blog">;
type Course = CollectionEntry<"courses">;
type CourseReference = CollectionEntry<"courseReferences">;
type Lesson = CollectionEntry<"lessons">;

export type LessonIdentity = {
  course: string;
  slug: string;
};

export type CourseReferenceKind = "glossary" | "further-reading";

export type CourseReferenceCapabilities = Partial<
  Record<CourseReferenceKind, CourseReference>
>;

export const formatDuration = (minutes: number) =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ""}`
    : `${minutes} minutes`;

export const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export const getCoursePath = (courseSlug: string) => `/courses/${courseSlug}/`;

export const getLessonIdentity = (lesson: Lesson): LessonIdentity => ({
  course: lesson.data.course,
  slug: lesson.data.slug,
});

export const getLessonKey = ({ course, slug }: LessonIdentity) =>
  `${course}/${slug}`;

export const getLessonPath = (courseSlug: string, lessonSlug: string) =>
  `${getCoursePath(courseSlug)}${lessonSlug}/`;

export const getCourseReferencePath = (
  courseSlug: string,
  kind: CourseReferenceKind,
) =>
  `${getCoursePath(courseSlug)}${kind === "glossary" ? "glossary" : "resources"}/`;

export const getOrderedLessonSummaries = (course: Course) =>
  [...course.data.plannedLessons].sort(
    (a, b) => a.lessonNumber - b.lessonNumber,
  );

const assertLessonNumberMatches = (
  courseSlug: string,
  lessonSlug: string,
  expectedLessonNumber: number,
  actualLessonNumber: number,
) => {
  if (actualLessonNumber !== expectedLessonNumber) {
    throw new Error(
      `Course "${courseSlug}" lesson "${lessonSlug}" has lesson number ${expectedLessonNumber} in its sequence, but the lesson entry declares ${actualLessonNumber}.`,
    );
  }
};

export const resolvePublishedLesson = (
  identity: LessonIdentity,
  lessons: Lesson[],
  context: string,
) => {
  const matches = lessons.filter(
    (lesson) =>
      lesson.data.status === "published" &&
      lesson.data.course === identity.course &&
      lesson.data.slug === identity.slug,
  );

  if (matches.length !== 1) {
    throw new Error(
      `${context} references published lesson "${getLessonKey(identity)}", but ${matches.length} published lesson entries match.`,
    );
  }

  return matches[0];
};

export const getPublishedLessonsForCourse = (
  course: Course,
  lessons: Lesson[],
) =>
  getOrderedLessonSummaries(course)
    .filter((summary) => summary.status === "published")
    .map((summary) => {
      const lesson = resolvePublishedLesson(
        { course: course.data.slug, slug: summary.slug },
        lessons,
        `Course "${course.data.slug}"`,
      );

      assertLessonNumberMatches(
        course.data.slug,
        summary.slug,
        summary.lessonNumber,
        lesson.data.lessonNumber,
      );

      return lesson;
    });

export const resolveBlogRelatedLessons = (post: BlogPost, lessons: Lesson[]) =>
  (post.data.relatedLessons ?? []).map((identity, relationIndex) =>
    resolvePublishedLesson(
      identity,
      lessons,
      `Blog entry "${post.id}" relatedLessons[${relationIndex}]`,
    ),
  );

export const getCourseReferenceCapabilities = (
  courseSlug: string,
  references: CourseReference[],
): CourseReferenceCapabilities => {
  const capabilities: CourseReferenceCapabilities = {};

  references
    .filter((reference) => reference.data.course === courseSlug)
    .forEach((reference) => {
      capabilities[reference.data.kind] = reference;
    });

  return capabilities;
};

export const getCourseReferencePaths = ({
  courses,
  courseReferences,
  kind,
}: {
  courses: Course[];
  courseReferences: CourseReference[];
  kind: CourseReferenceKind;
}) => {
  const coursesBySlug = new Map(
    courses.map((course) => [course.data.slug, course]),
  );

  return courseReferences
    .filter((reference) => reference.data.kind === kind)
    .map((reference) => {
      const course = coursesBySlug.get(reference.data.course);

      if (!course) {
        throw new Error(
          `${kind} reference "${reference.id}" has no matching course.`,
        );
      }

      return {
        params: { course: course.data.slug },
        props: { course, reference },
      };
    });
};

const assertSafeSegment = (context: string, value: string) => {
  if (!isSafeRouteSegment(value)) {
    throw new Error(`${context}: ${getRouteSegmentError(value)}`);
  }
};

const assertUnique = (
  values: string[],
  context: string,
  describe: (value: string) => string,
) => {
  const seen = new Set<string>();

  values.forEach((value) => {
    if (seen.has(value)) {
      throw new Error(`Duplicate ${context}: ${describe(value)}.`);
    }

    seen.add(value);
  });
};

export const validateLessonCatalog = ({
  courses,
  lessons,
  courseReferences,
}: {
  courses: Course[];
  lessons: Lesson[];
  courseReferences: CourseReference[];
}) => {
  assertUnique(
    courses.map((course) => course.data.slug),
    "course slug",
    (slug) => `"${slug}"`,
  );

  const coursesBySlug = new Map(
    courses.map((course) => [course.data.slug, course]),
  );

  courses.forEach((course) => {
    const courseSlug = course.data.slug;
    assertSafeSegment(`course ${course.id}`, courseSlug);

    assertUnique(
      course.data.plannedLessons.map((summary) => summary.slug),
      `planned lesson slug in course "${courseSlug}"`,
      (slug) => `"${slug}"`,
    );
    assertUnique(
      course.data.plannedLessons.map((summary) => String(summary.lessonNumber)),
      `planned lesson number in course "${courseSlug}"`,
      (lessonNumber) => lessonNumber,
    );

    course.data.plannedLessons.forEach((summary) => {
      assertSafeSegment(
        `planned lesson "${summary.slug}" in course "${courseSlug}"`,
        summary.slug,
      );
    });
  });

  const lessonKeys = lessons.map((lesson) => {
    const identity = getLessonIdentity(lesson);
    assertSafeSegment(`lesson course in "${lesson.id}"`, identity.course);
    assertSafeSegment(`lesson slug in "${lesson.id}"`, identity.slug);

    if (!coursesBySlug.has(identity.course)) {
      throw new Error(
        `Lesson "${lesson.id}" references unknown course "${identity.course}".`,
      );
    }

    return getLessonKey(identity);
  });

  assertUnique(lessonKeys, "published lesson identity", (key) => `"${key}"`);

  courses.forEach((course) => {
    const courseLessons = lessons.filter(
      (lesson) => lesson.data.course === course.data.slug,
    );

    assertUnique(
      courseLessons.map((lesson) => lesson.data.slug),
      `lesson slug in course "${course.data.slug}"`,
      (slug) => `"${slug}"`,
    );
    assertUnique(
      courseLessons.map((lesson) => String(lesson.data.lessonNumber)),
      `lesson number in course "${course.data.slug}"`,
      (lessonNumber) => lessonNumber,
    );

    getOrderedLessonSummaries(course)
      .filter((summary) => summary.status === "published")
      .forEach((summary) => {
        const lesson = resolvePublishedLesson(
          { course: course.data.slug, slug: summary.slug },
          lessons,
          `Course "${course.data.slug}"`,
        );

        assertLessonNumberMatches(
          course.data.slug,
          summary.slug,
          summary.lessonNumber,
          lesson.data.lessonNumber,
        );
      });

    courseLessons
      .filter((lesson) => lesson.data.status === "published")
      .forEach((lesson) => {
        const summary = course.data.plannedLessons.find(
          (plannedLesson) =>
            plannedLesson.status === "published" &&
            plannedLesson.slug === lesson.data.slug &&
            plannedLesson.lessonNumber === lesson.data.lessonNumber,
        );

        if (!summary) {
          throw new Error(
            `Published lesson "${getLessonKey(getLessonIdentity(lesson))}" is not declared in course "${course.data.slug}" with a matching published lesson number.`,
          );
        }
      });
  });

  const referenceKeys = courseReferences.map((reference) => {
    assertSafeSegment(
      `reference course in "${reference.id}"`,
      reference.data.course,
    );

    if (!coursesBySlug.has(reference.data.course)) {
      throw new Error(
        `Course reference "${reference.id}" references unknown course "${reference.data.course}".`,
      );
    }

    return `${reference.data.course}/${reference.data.kind}`;
  });

  assertUnique(referenceKeys, "course reference", (key) => `"${key}"`);

  return true;
};
