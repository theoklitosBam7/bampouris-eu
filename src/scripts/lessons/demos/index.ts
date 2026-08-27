import { initializeDependencyInjectionDemo } from "@/scripts/lessons/demos/dependency-injection";

type DemoInitializer = (lessonRoot: HTMLElement) => void;

const demoInitializers: Record<string, DemoInitializer> = {
  "dependency-injection": initializeDependencyInjectionDemo,
};
const initializedLessonRoots = new WeakSet<HTMLElement>();

export const initializeLessonDemos = () => {
  document
    .querySelectorAll<HTMLElement>("[data-lesson-page]")
    .forEach((root) => {
      if (initializedLessonRoots.has(root)) {
        return;
      }

      initializedLessonRoots.add(root);

      const demoKinds = new Set(
        Array.from(root.querySelectorAll<HTMLElement>("[data-lesson-demo]"))
          .map((demo) => demo.dataset.demoKind)
          .filter((kind): kind is string => Boolean(kind)),
      );

      demoKinds.forEach((kind) => {
        const initializeDemo = demoInitializers[kind];

        if (initializeDemo) {
          initializeDemo(root);
        }
      });
    });
};
