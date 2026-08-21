---
course: dependency-injection
title: What Is a Dependency?
description: Identify a dependency and move the transport choice into the caller.
difficulty: Beginner
durationMinutes: 15
lessonNumber: 1
slug: 0001-what-is-a-dependency
objectives:
  - Identify a dependency in a small frontend service.
  - Explain tight coupling with a concrete TypeScript example.
  - Write constructor injection and move the transport choice to the caller.
  - Explain why an injected fake can test service logic without network access.
prerequisites:
  - You can read and write basic TypeScript classes, functions, and promises.
  - You understand the role of browser APIs such as fetch.
publicationDate: 2026-08-20
updatedDate: 2026-08-20
sources:
  - label: "Martin Fowler: Inversion of Control Containers and the Dependency Injection pattern"
    href: https://martinfowler.com/articles/injection.html
  - label: "Brett L. Schuchert: DIP in the Wild"
    href: https://martinfowler.com/articles/dipInTheWild.html
  - label: "SSENSE Tech: DI vs Dependency Inversion vs IoC"
    href: https://medium.com/ssense-tech/dependency-injection-vs-dependency-inversion-vs-inversion-of-control-lets-set-the-record-straight-5dc818dc32d1
authoringSource:
  course: dependency-injection-swe
  document: lessons/0001-what-is-a-dependency.html
  importedAt: 2026-08-20
status: published
topics:
  - dependencies
  - coupling
  - constructor injection
aiAssistanceDisclosure: This lesson was manually adapted and reviewed for the public Astro site with AI assistance.
---

## Objectives

By the end of this lesson, you should be able to:

- Spot a dependency in a frontend service.
- Explain why a service that reaches for `fetch` is tightly coupled to the network.
- Move the transport choice from the service to its caller with constructor injection.
- Replace a real transport with a small fake when you test the service.

## Prerequisites

You need basic TypeScript knowledge. You should be comfortable with classes, functions, promises, and the browser `fetch` API.

## 1. Spot the dependency

Frontend code uses many things that a module did not create and cannot control: `fetch`, `localStorage`, the system clock, and API clients. Consider this small price loader:

```ts title="before.ts"
class PriceService {
  async loadPrice(productId: string): Promise<number> {
    const response = await fetch(`/api/price/${productId}`);
    const data = await response.json();
    return data.priceUsd as number;
  }
}
```

Ask one question. **What does this class need that it does not own?**

The answer is the network. `fetch` is a [dependency](/courses/dependency-injection/glossary/#dependency): something the module needs to do its job but should not decide for itself.

The class works, but two choices are now welded together:

- Every use of `PriceService` performs real HTTP.
- A test of `loadPrice` needs the network or must monkey-patch `globalThis.fetch`.

### Confusing use with ownership

A class can use a dependency without owning the decision about which implementation to use. If changing the transport means editing the service, the service is coupled to a concrete detail.

> **Coupling** is how far a change travels. Here, changing how prices are fetched means editing the class itself. The service and transport are tightly coupled because they share concrete details, not only a job description. See the [coupling glossary entry](/courses/dependency-injection/glossary/#coupling).

## 2. Move the dependency into the constructor

Dependency injection needs no framework or container. The class declares what it needs, and the caller supplies it:

```ts title="after.ts"
class PriceService {
  // Needs a function: id -> price. That is all.
  constructor(private readonly fetchPrice: (id: string) => Promise<number>) {}

  async loadPrice(productId: string): Promise<number> {
    return this.fetchPrice(productId);
  }
}
```

The function parameter is [constructor injection](/courses/dependency-injection/glossary/#constructor-injection). The choice of transport moved out of the class and to the code that builds it.

The caller can now wire the real transport at the application edge:

```ts title="wiring.ts"
const service = new PriceService(async (id) => {
  const response = await fetch(`/api/price/${id}`);
  return (await response.json()).priceUsd as number;
});
```

The service changed in one place. Before, it fetched its dependency. After, it received that dependency from its caller.

**Give, do not take.** That is the essential idea of dependency injection. [Fowler describes the pattern and its history](https://martinfowler.com/articles/injection.html).

No interface was introduced, and none was needed. Interfaces and abstractions are a separate design move covered by the next planned lesson.

## 3. See the difference

The service below is unchanged between the two examples. Only the constructor argument changes. One transport uses the network; the other is an offline fake.

### Explanatory network-dependent example

This transport can fail when the page has no `/api/price/:id` endpoint. It is shown to explain the coupling; it is **not an offline demo and does not run in this lesson**:

```ts title="real-transport.ts"
const realTransport = (id: string): Promise<number> =>
  fetch(`/api/price/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`transport failed (HTTP ${response.status})`);
      }
      return response.json();
    })
    .then((data) => data.priceUsd as number);

const networkService = new PriceService(realTransport);
```

### Offline fake

This fake returns deterministic values and never calls the network:

```ts title="fake-transport.ts"
const fakeTransport = async (id: string): Promise<number> =>
  ({ "p-042": 1290, "p-007": 499 })[id] ?? 0;

const offlineService = new PriceService(fakeTransport);
const price = await offlineService.loadPrice("p-042");
// 1290
```

<div
  class="lesson-demo"
  data-demo-kind="dependency-injection"
  data-lesson-demo
>
  <div class="lesson-demo-heading">
    <span class="lesson-interaction-label">Offline demonstration</span>
    <h4>Run the service with an injected transport</h4>
  </div>
  <p>
    The class stays the same. Choose a transport to see how the wiring changes
    its behaviour.
  </p>
  <p class="lesson-demo-note" data-demo-network-note>
    <strong>Explanatory network-dependent example.</strong> The real transport is
    shown above but never runs here. Simulate its failure to see the same
    coupling without a network request.
  </p>
  <div class="lesson-demo-controls">
    <button data-demo-action="network" type="button">
      Simulate real transport failure
    </button>
    <button data-demo-action="fake" type="button">
      Call with injected fake
    </button>
  </div>
  <pre
    aria-atomic="true"
    aria-live="polite"
    class="lesson-demo-output"
    data-demo-output
    role="status"
  >$ waiting. Choose a transport.</pre>
</div>

The class source stayed the same. The behaviour changed at the wiring. That is [testability](/courses/dependency-injection/glossary/#fake) as a result of the design, not of a mocking tool.

## 4. Retrieve the idea

Try to answer these questions before opening the model answers:

1. In the terms used in this lesson, what counts as a dependency of a module?
2. What exactly does constructor injection change in the `after` code?
3. What lets one class produce two different behaviours?
4. Which symptom most directly shows that the `before` class is tightly coupled?

<div class="lesson-quiz" data-lesson-quiz>
  <script type="application/json">
    {
      "title": "Four-question retrieval quiz",
      "questions": [
        {
          "question": "In this lesson's terms, what counts as a dependency of a module?",
          "options": [
            "A needed thing it does not own",
            "A needed thing it does not make",
            "A needed thing it does not name",
            "A needed thing it does not use"
          ],
          "answer": 0,
          "explain": "A dependency is something the module needs but does not control, such as fetch, storage, or the clock. The module can import and name it. It must not own the choice."
        },
        {
          "question": "What exactly does constructor injection change in the after code?",
          "options": [
            "Dependencies now arrive as constructor parameters",
            "Dependencies appear as compiled class fields",
            "Dependencies return as function call outputs",
            "Dependencies vanish as inferred generic types"
          ],
          "answer": 0,
          "explain": "The class used to grab the dependency. Now the dependency arrives through the constructor. The class signature tells the reader what it needs."
        },
        {
          "question": "In the demo, what lets one class produce two different behaviours?",
          "options": [
            "The injected dependency is swapped",
            "The class source is edited",
            "The network itself is repaired",
            "The test runner is configured"
          ],
          "answer": 0,
          "explain": "The class stays the same. The constructor argument changes. That is the key idea in DI."
        },
        {
          "question": "Which symptom most directly shows the before class is tightly coupled?",
          "options": [
            "Tests need the real network",
            "Types need the real runtime",
            "Bundles need the real server",
            "Workers need the real browser"
          ],
          "answer": 0,
          "explain": "No network means no test. The class cannot run without its concrete transport. Coupling is measured by what a change or a test must bring with it."
        }
      ]
    }
  </script>
  <noscript>
    <p>Enable JavaScript to answer this quiz and receive feedback.</p>
  </noscript>
</div>

<details class="lesson-reveal">
  <summary>Show model answers</summary>
  <ol>
    <li>A dependency is something the module needs but does not own or control, such as <code>fetch</code>, storage, or the clock.</li>
    <li>The dependency arrives as a constructor parameter, so the class signature tells the truth about what it needs.</li>
    <li>The caller swaps the constructor argument while the class source remains unchanged.</li>
    <li>Tests need the real network, so the service cannot be exercised without its concrete transport.</li>
  </ol>
</details>

<details class="lesson-reveal">
  <summary>"Dependency injection is..." Finish the sentence</summary>
  <p>It is a wiring technique where objects receive dependencies from outside, usually through the constructor, instead of creating or fetching them. A framework is optional.</p>
</details>

<details class="lesson-reveal">
  <summary>Why does injection improve testability?</summary>
  <p>The class no longer owns the transport. A test can construct it with a fake, without network access or monkey-patching, so the test exercises the service logic.</p>
</details>

## Exercises

1. Find a browser API used directly inside one of your services. Write down what the service needs and what choice it currently owns.
2. Replace that direct call with a function constructor parameter. Keep the parameter as small as the service actually needs.
3. Create a deterministic fake and use it to exercise the service without a network request.
4. Explain which code is now the composition point: the service or the caller that constructs it?

## Further reading

- [Dependency Injection vs Dependency Inversion vs Inversion of Control, SSENSE Tech](https://medium.com/ssense-tech/dependency-injection-vs-dependency-inversion-vs-inversion-of-control-lets-set-the-record-straight-5dc818dc32d1). This article walks through a TypeScript refactor.
- [InversionOfControl, Martin Fowler](https://martinfowler.com/bliki/InversionOfControl.html). It explains the question of who calls whom.
- [DIP in the Wild, Brett L. Schuchert](https://martinfowler.com/articles/dipInTheWild.html). It separates wiring, direction, and shape.
- Review the [course glossary](/courses/dependency-injection/glossary/) and the [curated resources](/courses/dependency-injection/resources/) before the next lesson.

## Sources

- Fowler, [Inversion of Control Containers and the Dependency Injection pattern](https://martinfowler.com/articles/injection.html). This source defines DI and constructor injection.
- Schuchert, [DIP in the Wild](https://martinfowler.com/articles/dipInTheWild.html). This source explains the coupling and wiring framing.
- SSENSE Tech, [DI vs Dependency Inversion vs IoC](https://medium.com/ssense-tech/dependency-injection-vs-dependency-inversion-vs-inversion-of-control-lets-set-the-record-straight-5dc818dc32d1). This is the primary TypeScript reading.
