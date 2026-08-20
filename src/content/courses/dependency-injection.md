---
slug: dependency-injection
title: Dependency Injection in TypeScript (Frontend)
description: Learn dependency injection, inversion of control, and dependency inversion through short, framework-free TypeScript lessons.
status: pilot
difficulty: Intermediate
durationMinutes: 120
topics:
  - dependency injection
  - inversion of control
  - dependency inversion
  - composition roots
  - testability
objectives:
  - Explain dependency injection, inversion of control, and dependency inversion with small TypeScript examples.
  - Write constructor injection for browser-facing frontend services without a framework or container.
  - Explain why injection improves testability and demonstrate it with a fake that does not use the network.
  - Identify the composition root and describe where frontend wiring belongs.
prerequisites:
  - You can read and write basic TypeScript classes, functions, and promises.
  - You understand the role of common browser APIs such as fetch and localStorage.
pilotScope:
  included:
    - Course overview, objectives, and prerequisites.
    - Planned six-lesson sequence with publication status for each lesson.
    - Further reading for continued study.
  excluded:
    - Lesson pages and glossary; these will be published in later pilot updates.
publicationDate: 2026-08-19
updatedDate: 2026-08-19
sources:
  - label: "Martin Fowler: Inversion of Control Containers and the Dependency Injection pattern"
    href: https://martinfowler.com/articles/injection.html
  - label: "Dependency Injection Principles, Practices, and Patterns: chapter 1"
    href: https://livebook.manning.com/book/dependency-injection-principles-practices-patterns/chapter-1/
authoringSource:
  course: dependency-injection-swe
  document: MISSION.md
  importedAt: 2026-08-20
aiAssistanceDisclosure: This course metadata was reviewed and adapted for the public Astro site with AI assistance.
plannedLessons:
  - lessonNumber: 1
    slug: 0001-what-is-a-dependency
    title: What Is a Dependency?
    description: Identify a dependency and move the transport choice into the caller.
    durationMinutes: 15
    difficulty: Beginner
    status: planned
    topics:
      - dependencies
      - coupling
      - constructor injection
  - lessonNumber: 2
    slug: 0002-depend-on-the-abstraction
    title: Depend on the Abstraction
    description: Replace concrete details with a small contract so a service can accept different implementations.
    durationMinutes: 20
    difficulty: Beginner
    status: planned
    topics:
      - abstractions
      - contracts
      - test doubles
  - lessonNumber: 3
    slug: 0003-inversion-of-control
    title: Inversion of Control
    description: Distinguish inversion of control from dependency injection and explain how a caller or framework decides what runs.
    durationMinutes: 20
    difficulty: Intermediate
    status: planned
    topics:
      - inversion of control
      - control flow
      - frameworks
  - lessonNumber: 4
    slug: 0004-the-composition-root
    title: The Composition Root
    description: Keep object-graph wiring in one place so application code receives dependencies instead of constructing them.
    durationMinutes: 20
    difficulty: Intermediate
    status: planned
    topics:
      - composition roots
      - object graphs
      - application wiring
  - lessonNumber: 5
    slug: 0005-di-in-react
    title: DI in React
    description: Apply dependency injection in React and distinguish a dependency from a delivery mechanism such as Context.
    durationMinutes: 20
    difficulty: Intermediate
    status: planned
    topics:
      - React
      - context
      - frontend architecture
  - lessonNumber: 6
    slug: 0006-scaling-the-composition-root
    title: Scaling the Composition Root
    description: Keep frontend wiring easy to trace as the application grows by making composition decisions explicit and local.
    durationMinutes: 25
    difficulty: Advanced
    status: planned
    topics:
      - composition roots
      - scaling
      - maintainability
---

This short, self-study course is for software engineers who want to explain and apply dependency injection in TypeScript frontend code. It starts with a small example, then moves to abstractions, control flow, and application wiring.

The public pilot begins with the course overview. Lesson content will be imported and reviewed in sequence. The cards below show the planned course order. Unpublished lesson routes are not available yet.
