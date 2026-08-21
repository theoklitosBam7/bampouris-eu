import type { CollectionEntry } from "astro:content";

type Course = CollectionEntry<"courses">;
type Lesson = CollectionEntry<"lessons">;

export const formatDuration = (minutes: number) =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ""}`
    : `${minutes} minutes`;

export const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export const getLessonPath = (courseSlug: string, lessonSlug: string) =>
  `/courses/${courseSlug}/${lessonSlug}/`;

export const getPublishedLessonsForCourse = (
  course: Course,
  lessons: Lesson[],
) => {
  const publishedSummaries = course.data.plannedLessons
    .filter((summary) => summary.status === "published")
    .sort((a, b) => a.lessonNumber - b.lessonNumber);
  const lessonsBySlug = new Map(
    lessons.map((lesson) => [lesson.data.slug, lesson]),
  );

  return publishedSummaries.map((summary) => {
    const lesson = lessonsBySlug.get(summary.slug);
    const isMatchingLesson =
      lesson &&
      lesson.data.status === "published" &&
      lesson.data.course === course.data.slug &&
      lesson.data.lessonNumber === summary.lessonNumber;

    if (!isMatchingLesson) {
      throw new Error(
        `Course "${course.data.slug}" references published lesson "${summary.slug}" without a matching published lesson entry.`,
      );
    }

    return lesson;
  });
};
