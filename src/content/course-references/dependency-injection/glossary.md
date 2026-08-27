---
course: dependency-injection
kind: glossary
eyebrow: Reference · course glossary
title: Dependency Injection glossary
description: The working vocabulary for the Dependency Injection in TypeScript course, with short definitions and interview-ready distinctions.
---

<p>
    Use this page when a term feels familiar but its boundaries are not clear.
    The three terms people often mix up are separated first: dependency
    injection is about wiring, inversion of control is about direction, and
    dependency inversion is about shape.
  </p>

  <div class="compare-table-wrapper">
    <table class="compare-table">
      <thead>
        <tr>
          <th>Term</th>
          <th>Kind of thing</th>
          <th>One line</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Dependency Injection</td>
          <td>Technique (wiring)</td>
          <td>
            Objects receive their dependencies from outside instead of creating
            them.
          </td>
        </tr>
        <tr>
          <td>Inversion of Control</td>
          <td>Principle (direction)</td>
          <td>
            A caller or framework controls when your code runs. The rule is "Do
            not call us; we will call you."
          </td>
        </tr>
        <tr>
          <td>Dependency Inversion</td>
          <td>Principle (shape)</td>
          <td>
            High-level and low-level modules depend on abstractions rather than
            on each other's concrete details.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <p class="reference-note">
    <a href="https://martinfowler.com/articles/dipInTheWild.html">
      DIP in the Wild
    </a>
    describes DI as <strong>wiring</strong>, IoC as
    <strong>direction</strong>, and DIP as <strong>shape</strong>.
  </p>

  <dl class="term-list">
    <div class="term-card" id="abstraction">
      <dt>Abstraction <span class="term-hint">what, not which</span></dt>
      <dd>
        A description of what is needed without choosing a particular provider.
        In TypeScript, this is often an <code>interface</code> or a function type.
        <p class="interview-line">
          "An abstraction names the capability I need; the wiring decides who
          provides it."
        </p>
      </dd>
    </div>
    <div class="term-card" id="composition-root">
      <dt>
        Composition root <span class="term-hint"
          >wire in main, not in the middle</span
        >
      </dt>
      <dd>
        The single place, as close as possible to the application entry point,
        where concrete dependencies are selected and objects are assembled. The
        application logic and libraries do not choose the concrete classes; the
        entry point does.
        <p class="interview-line">
          "Dependencies are composed at the edge of the app, so the rest of the
          code does not need to construct them."
          See
          <a href="https://livebook.manning.com/book/dependency-injection-principles-practices-patterns/chapter-1/">
            Seemann and van Deursen's chapter 1
          </a>
          for the composition-root practice.
        </p>
      </dd>
    </div>
    <div class="term-card" id="constructor-injection">
      <dt>
        Constructor injection <span class="term-hint"
          >needs to go in the parentheses</span
        >
      </dt>
      <dd>
        Passing dependencies as constructor parameters. The dependency list is
        visible in the signature, and a half-built object is harder to create.
        <p class="interview-line">
          "If it is on the constructor, the type system enforces it. You cannot
          forget to provide it."
        </p>
      </dd>
    </div>
    <div class="term-card" id="coupling">
      <dt>Coupling <span class="term-hint">change travels</span></dt>
      <dd>
        How much one module must know about another, and how far a change in one
        forces changes in the other. Tight coupling names concrete details;
        loose coupling agrees on a small abstraction.
        <p class="interview-line">
          "Coupling is the distance a change travels. Loose coupling lets the
          change stop at the wiring."
        </p>
      </dd>
    </div>
    <div class="term-card" id="dependency">
      <dt>Dependency <span class="term-hint">a need you do not own</span></dt>
      <dd>
        Something a module needs to do its job but does not control: another
        object or service, a function, <code>fetch</code>, the system clock, or
        <code>localStorage</code>. If it can change, fail, or need replacing
        without the module's logic changing, it is a dependency rather than an
        owned detail.
        <p class="interview-line">
          "A dependency is anything the module needs but should not decide for
          itself."
        </p>
      </dd>
    </div>
    <div class="term-card" id="dip">
      <dt>
        Dependency Inversion Principle (DIP) <span class="term-hint"
          >abstractions, not concretions</span
        >
      </dt>
      <dd>
        High-level and low-level modules both depend on abstractions. The
        details point toward the abstraction owned by the policy instead of
        forcing the policy to point at concrete details.
        <p class="interview-line">
          "DIP flips the arrow. Details depend on the abstraction my code
          defines."
        </p>
      </dd>
    </div>
    <div class="term-card" id="di">
      <dt>
        Dependency Injection (DI) <span class="term-hint"
          >give, do not take</span
        >
      </dt>
      <dd>
        A wiring technique in which objects receive dependencies from outside,
        through a constructor, setter, or parameter, instead of constructing or
        fetching them. It needs no framework. Martin Fowler named the pattern in
        his 2004 article on dependency injection.
        <p class="interview-line">
          "DI means dependencies are supplied from outside, so behaviour can
          change without editing the class."
        </p>
      </dd>
    </div>
    <div class="term-card" id="fake">
      <dt>Fake <span class="term-hint">a working stand-in</span></dt>
      <dd>
        A lightweight working implementation used in tests. A fake transport can
        return canned values without making a network request. It lets the test
        exercise the service logic rather than the infrastructure. Unlike a
        mock, a fake usually focuses on providing working behaviour instead of
        asserting how the dependency was used. See
        <a href="https://kentcdodds.com/blog/stop-mocking-fetch">
          Kent C. Dodds's discussion of fakes
        </a>.
        <p class="interview-line">
          "I inject a fake so the test exercises my code, not the network."
        </p>
      </dd>
    </div>
    <div class="term-card" id="hollywood-principle">
      <dt>
        Hollywood Principle <span class="term-hint">do not call us...</span>
      </dt>
      <dd>
        "Do not call us; we will call you." It is the slogan for inversion of
        control: your code registers or supplies behaviour, while another caller
        decides when to run it.
        <p class="interview-line">
          "A framework calls my code; my code does not drive the framework."
        </p>
      </dd>
    </div>
    <div class="term-card" id="injection">
      <dt>Injection <span class="term-hint">the delivery itself</span></dt>
      <dd>
        The act of handing a dependency to the code that needs it. Constructor,
        setter, property, and parameter injection are different delivery
        choices. Passing a dependency through component props is parameter
        injection; constructor injection is the default in this course.
        <p class="interview-line">
          "Injection is delivery. Where you deliver it is a design choice;
          constructor is the default."
        </p>
      </dd>
    </div>
    <div class="term-card" id="interface">
      <dt>Interface <span class="term-hint">a structural contract</span></dt>
      <dd>
        A TypeScript construct that describes a value's shape. TypeScript is
        structurally typed, so an object with the right shape can satisfy an
        interface. An interface disappears at runtime.
        <p class="interview-line">
          "A TypeScript interface is a compile-time contract, not a runtime
          lookup token."
        </p>
      </dd>
    </div>
    <div class="term-card" id="ioc">
      <dt>
        Inversion of Control (IoC) <span class="term-hint">who drives?</span>
      </dt>
      <dd>
        A broad principle in which control over program flow or object creation
        moves from your code to an external framework or caller. Frameworks are
        its everyday example. Dependency injection is one technique within IoC.
        <p class="interview-line">
          "IoC asks who is driving. If it is not my code, control is inverted."
        </p>
      </dd>
    </div>
    <div class="term-card" id="ioc-container">
      <dt>
        IoC container / DI container <span class="term-hint"
          >a factory with a map</span
        >
      </dt>
      <dd>
        A library that maps tokens to providers and constructs an object graph.
        Examples include Angular's injector, tsyringe, and InversifyJS. A
        container can automate a composition root, but it is never required for
        dependency injection. Containers are outside the main line of this
        course.
        <p class="interview-line">
          "A container automates the composition root; it does not change what
          DI is."
        </p>
      </dd>
    </div>
    <div class="term-card" id="service">
      <dt>Service <span class="term-hint">does one job well</span></dt>
      <dd>
        A reusable object dedicated to one responsibility, such as data access,
        logging, or notifications. A service is often the module that receives a
        dependency. In Angular, a service can be registered for injection. See
        <a href="https://angular.dev/guide/di">the Angular documentation</a>.
        <p class="interview-line">
          "A service is a unit of behaviour other code depends on."
        </p>
      </dd>
    </div>
    <div class="term-card" id="service-locator">
      <dt>
        Service Locator <span class="term-hint">the anti-pattern next door</span
        >
      </dt>
      <dd>
        An object that code asks for dependencies at runtime, such as
        <code>locator.get(PaymentApi)</code>, instead of receiving them. It
        hides dependencies from signatures, forces code to depend on the locator,
        and defers failures to runtime. See
        <a href="https://martinfowler.com/articles/injection.html">
          Fowler's discussion of DI and Service Locator
        </a>
        for the comparison.
        <p class="interview-line">
          "A locator pulls. DI pushes. Pushing keeps dependencies visible in the
          constructor."
        </p>
      </dd>
    </div>
    <div class="term-card" id="test-double">
      <dt>
        Test double <span class="term-hint">stunt double for a dependency</span>
      </dt>
      <dd>
        An umbrella term for something standing in for a dependency during a
        test: a fake provides working behaviour, a stub returns canned answers,
        a spy records calls, and a mock asserts interactions. The distinctions
        describe the role the stand-in plays, not a different injection
        technique. See
        <a href="https://vitest.dev/guide/mocking">Vitest's mocking guide</a>.
        <p class="interview-line">
          "Test doubles let tests swap injected dependencies without touching
          production code."
        </p>
      </dd>
    </div>
    <div class="term-card" id="token">
      <dt>Token <span class="term-hint">the key in the map</span></dt>
      <dd>
        The key a container uses to look up a dependency. In Angular, this may be
        a type or a dedicated <code>InjectionToken</code>. A token must exist at
        runtime, which is why a plain TypeScript interface is not enough for a
        container lookup.
        <p class="interview-line">
          "A token is the lookup key. In TypeScript it must exist at runtime, so
          a plain interface is not enough for a container."
        </p>
      </dd>
    </div>
    <div class="term-card" id="wiring">
      <dt>Wiring <span class="term-hint">choosing the real ones</span></dt>
      <dd>
        Selecting concrete dependencies and connecting them to the objects that
        need them. Wiring belongs at the
        <a href="#composition-root">composition root</a>, not in the middle of
        application logic.
        <p class="interview-line">
          "Wiring is where policy meets plumbing. It is the one place concrete
          classes are named."
        </p>
      </dd>
    </div>
  </dl>

  <section aria-labelledby="glossary-citations-title" class="source-section">
    <h2 id="glossary-citations-title">Glossary citations</h2>
    <ul>
      <li>
        <a href="https://martinfowler.com/articles/injection.html">
          Martin Fowler: Inversion of Control Containers and the Dependency
          Injection pattern
        </a>. It covers DI, injection forms, and Service Locator.
      </li>
      <li>
        <a href="https://martinfowler.com/bliki/InversionOfControl.html">
          Martin Fowler: InversionOfControl
        </a>. It explains IoC and the Hollywood Principle.
      </li>
      <li>
        <a href="http://www.butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod">
          Robert C. Martin: The Principles of OOD
        </a>. It defines DIP.
      </li>
      <li>
        <a href="https://martinfowler.com/articles/dipInTheWild.html">
          Brett L. Schuchert: DIP in the Wild
        </a>. It explains the wiring, direction, and shape framing.
      </li>
      <li>
        <a href="https://livebook.manning.com/book/dependency-injection-principles-practices-patterns/chapter-1/">
          Mark Seemann and Steven van Deursen: Dependency Injection Principles,
          Practices, and Patterns, chapter 1
        </a>. It covers composition roots and Pure DI.
      </li>
      <li>
        <a href="https://kentcdodds.com/blog/stop-mocking-fetch">
          Kent C. Dodds: Stop mocking fetch
        </a>. It explains the use of hand-written fakes in browser tests.
      </li>
    </ul>
  </section>
