---
title: "Setup Unit Testing Tools in Angular CLI Project"
description: "Setup unit testing tools in Angular CLI project"
pubDate: "2022-01-21"
heroImage: "/blog-placeholder-2.jpg"
---

Every developer have to ensure that his/her application is working as expected. A safeguard to that purpose are unit tests.

## The Defaults of an Angular CLI Generated Project

An Angular CLI generated project comes by default with [Karma](https://karma-runner.github.io/latest/index.html) and [Jasmine](https://jasmine.github.io/) for unit testing. However, there are people who prefer other tools such as [Jest](https://jestjs.io/).

I'm not going, in this post, to compare or choose the one over the other. I will only show you the steps to move from Karma/Jasmine to Jest. At the end, it's just a case of taste.

## Remove Karma & Jasmine Related Packages

- Uninstall the `npm` packages:

```sh
npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
```

- Delete the no more needed Karma configuration files:

```sh
rm ./karma.conf.js ./src/test.ts
```

## Install Jest

```sh
npm i -D jest @types/jest jest-preset-angular @angular-builders/jest
```

- `@types/jest`: This package contains type definitions for Jest.
- `jest-preset-angular`: It is Jest preset configuration and TypeScript preprocessor with source map support for Jest that lets you use Jest to test Angular projects.
- `@angular-builders/jest`: Allows running `ng test` with Jest instead of Karma & Jasmine. The builder comes to provide zero configuration setup for Jest while keeping the workspace clear of boilerplate code.

To make use of `@angular-builders/jest`, the only we need to do is to change our `angular.json` file as below:

```diff title="angular.json"
  }
},
"test": {
-  "builder": "@angular-devkit/build-angular:karma",
+  "builder": "@angular-builders/jest:run",
  "options": {
-    "main": "src/test.ts",
-    "polyfills": "src/polyfills.ts",
-    "tsConfig": "tsconfig.spec.json",
-    "karmaConfig": "karma.conf.js",
-    "inlineStyleLanguage": "scss",
-    "assets": ["src/favicon.ico", "src/assets"],
-    "styles": ["src/styles.scss"],
-    "scripts": []
+    "no-cache": true
  },
  "lint": {
```

You may find details how to change the builder options [here](https://www.npmjs.com/package/@angular-builders/jest).

## Setup Jest in our Project

We create a config file in project's root directory with the name `jest.config.js`:

```js title="jest.config.js"
module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
};
```

As you guess from the above configuration, we will now create `setup-jest.ts` in root directory:

```ts title="setup-jest.ts"
import "jest-preset-angular/setup-jest";
import "./jest-global-mocks";
```

The second `import` above is optional at first. Because `jest-preset-angular` uses `JSDOM`, which is different from normal browsers, we might need some global browser mocks to simulate the behaviors of real browsers in `JSDOM`. To add global mocks, we can create `jest-global-mocks.ts` and use it in our Jest setup.

You may find more information about `jest-preset-angular` in official [docs](https://thymikee.github.io/jest-preset-angular/) and about Jest and JSDOM in this [article](https://freecontent.manning.com/testing-with-node-jest-and-jsdom/).

Here is an example of `jest-global-mocks.ts`:

```ts title="jest-global-mocks.ts"
Object.defineProperty(window, "CSS", { value: null });
Object.defineProperty(document, "doctype", {
  value: "<!DOCTYPE html>",
});
Object.defineProperty(window, "getComputedStyle", {
  value: () => {
    return {
      display: "none",
      appearance: ["-webkit-appearance"],
    };
  },
});
Object.defineProperty(document.body.style, "transform", {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});
```

Finally, in `tsconfig.spec.json` file, we have to take care of at least two things:

- Replace `jasmine` in types array with `jest`, as we want our tests to be type-checked against Jest typings and not Jasmine.
- Remove `test.ts` entry from files array. This file was responsible for Karma setup, we don't need it here anymore.

```diff title="tsconfig.spec.json"
"compilerOptions": {
  "outDir": "./out-tsc/spec",
  "types": [
-    "jasmine"
-  ]
+    "jest",
+    "node"
+  ],
+  "esModuleInterop": true,
+  "emitDecoratorMetadata": true,
},
"files": [
-  "src/test.ts",
  "src/polyfills.ts"
],
"include": [
```

For other options you may check [here](https://www.typescriptlang.org/tsconfig).

## Last But Not Least

A nice and powerful tool to simplify our Angular unit tests is [Spectator](https://ngneat.github.io/spectator/):

- Helps you get rid of all the boilerplate grunt work, leaving you with readable, sleek and streamlined unit tests.
- Write tests for components, directives, services, and more, without having to learn TestBed, ComponentFixture, and DebugElement APIs.

We can install it with:

```sh
npm i -D @ngneat/spectator
```

I hope in a future post to show a few examples of how we can use it and take advantage of its features.
