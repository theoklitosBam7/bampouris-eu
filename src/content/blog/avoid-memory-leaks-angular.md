---
title: "Avoid Memory Leaks in Angular"
description: "Avoid memory leaks in Angular"
pubDate: "2021-03-24"
heroImage: "/blog-placeholder-1.jpg"
---

Almost five years ago, Ben Lesh wrote a nice article with title: [RxJS: Don’t Unsubscribe](https://medium.com/@benlesh/rxjs-dont-unsubscribe-6753ed4fda87). The author of course doesn't tell us to never care about our `Subscription`. He means that we must find a way that we don't have to perform `.unsubscribe()` manually in each one. Let's start our mission!

## Our Road Map

The lifetime of some global components, such as AppComponent, is the same as the lifetime of the app itself. If we know that we're dealing with such a case it is acceptable to `.subscribe()` to an Observable without providing any memory leak guard step. However, handle memory leaks during the implementation of an Angular application is a critical task for every developer. We'll begin our quest with showing what we mean with **memory leak** and we'll proceed solving the problem at first with the "traditional" way of `.unsubscribe()`, until we explore our preferable pattern.

- [The Bad Open Subscriptions](#the-bad-open-subscription)
- [Unsubscribe the Old Way](#unsubscribe-the-old-way)
- [The Async Pipe](#the-async-pipe)
- [The RxJS Operators](#the-rxjs-operators)
- [The DestroyService](#the-destroyservice)
- [Conclusions](#conclusions)

## The Bad Open Subscriptions

We have a simple demo app with two routing components: `FirstComponent` and `SecondComponent` (**First Cmp** and **Second Cmp** nav link buttons respectively). The `FirstComponent` (corresponding to path `/first`) subscribes to a `timer1$` observable and sends messages to a `ScreenMessagesComponent` via a `MessageService`. The messages are displayed at the bottom of the screen.

[Live Example](https://stackblitz.com/github/theoklitosBam7/ng-unsubscribe-examples/tree/1-show-memory-leak)

```ts title="first.component.ts"
export class FirstComponent implements OnInit {
  timer1$ = timer(0, 1000);

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.timer1$.subscribe((val) =>
      this.messageService.add(`FirstComponent timer1$: ${val}`)
    );
  }
}
```

When we navigate to `/second` path, `FirstComponent` has been destroyed. However, we still see outgoing messages from the above subscription. This is happening because we forgot to "close the door behind us": our app has an open `Subscription`. As we go back and forth we add more and more subscriptions which will close only when the app is closed. We have to deal with **Memory Leaks!**

![memory-leaks-1](https://tb-projphotos.netlify.app/avoid-memory-leaks-angular/memory-leaks-1.gif)

## Unsubscribe the Old Way

A straightforward way to solve to above problem is to implement the [lifecycle hook](https://angular.io/guide/lifecycle-hooks) method `ngOnDestroy()`. As we read from the official documentation:

> ...Unsubscribe Observables and detach event handlers to avoid memory leaks...

```ts title="first.component.ts"
export class FirstComponent implements OnInit, OnDestroy {
  private timer1$ = timer(0, 1000);

  private subscription: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.subscription = this.timer1$.subscribe((val) =>
      this.messageService.add(`FirstComponent timer1$: ${val}`)
    );
  }
  // highlight-start
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  // highlight-end
}
```

![memory-leaks-2](https://tb-projphotos.netlify.app/avoid-memory-leaks-angular/memory-leaks-2.gif)

Furthermore, if we have more than one `Subscription`, we have to do the same job for each of them.

```ts title="first.component.ts"
export class FirstComponent implements OnInit, OnDestroy {
  private timer1$ = timer(0, 1000);
  private timer2$ = timer(0, 2500);

  private subscription1: Subscription;
  private subscription2: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.subscription1 = this.timer1$.subscribe((val) =>
      this.messageService.add(`FirstComponent timer1$: ${val}`)
    );

    this.subscription2 = this.timer2$.subscribe((val) =>
      this.messageService.add(`FirstComponent timer2$: ${val}`)
    );
  }

  ngOnDestroy(): void {
    // highlight-start
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    // highlight-end
  }
}
```

In case we don't have only one or two subscriptions and we want to reduce the number of `.unsubscribe()` calls, we can create a parent `Subscription` and add to it the child ones. When a parent subscription is unsubscribed, any child subscriptions that were added to it are also unsubscribed.

[Live Example](https://stackblitz.com/github/theoklitosBam7/ng-unsubscribe-examples/tree/2-unsubscribe-old-way)

```ts title="first.component.ts"
export class FirstComponent implements OnInit, OnDestroy {
  private timer1$ = timer(0, 1000);
  private timer2$ = timer(0, 2500);

  private subscription = new Subscription();
  // highlight-next-line
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // highlight-next-line
    this.subscription.add(
      this.timer1$.subscribe((val) =>
        this.messageService.add(`FirstComponent timer1$: ${val}`)
      )
    );
    // highlight-next-line
    this.subscription.add(
      this.timer2$.subscribe((val) =>
        this.messageService.add(`FirstComponent timer2$: ${val}`)
      )
    );
  }

  ngOnDestroy(): void {
    // highlight-next-line
    this.subscription.unsubscribe();
  }
}
```

Using a parent `Subscription` we don't have to care about plenty of properties and we also perform only one `.unsubscribe()`.

## The Async Pipe

[AsyncPipe](https://angular.io/api/common/AsyncPipe) kick ass! It has no rival when we want to display data "reactively" in our component's template.

> The async pipe subscribes to an Observable or Promise and returns the latest value it has emitted. When a new value is emitted, the async pipe marks the component to be checked for changes. When the component gets destroyed, the async pipe unsubscribes automatically to avoid potential memory leaks.

[Live Example](https://stackblitz.com/github/theoklitosBam7/ng-unsubscribe-examples/tree/3-async-pipe)

```ts title="first.component.ts"
@Component({
  selector: 'app-first',
  template: `
    <p>first component works!</p>
    <p>{{ timer3$ | async }}</p>
  `,
})
export class FirstComponent implements OnInit, OnDestroy {
  ...

  timer3$ = timer(0, 1000);

  ...
}
```

Using the `AsyncPipe` there is no need neither to `.subscribe()` nor to `.unsubscribe()` manually.

## The RxJS Operators

[RxJS](https://rxjs-dev.firebaseapp.com/guide/overview) is a library for composing asynchronous and event-based programs by using observable sequences. It has some great operators such as:

- [take](https://rxjs-dev.firebaseapp.com/api/operators/take)
- [takeWhile](https://rxjs-dev.firebaseapp.com/api/operators/takeWhile)
- [first](https://rxjs-dev.firebaseapp.com/api/operators/first)
- [last](https://rxjs-dev.firebaseapp.com/api/operators/last)

We won't stand in each of them. We'll see only the usage of [takeUntil](https://rxjs-dev.firebaseapp.com/api/operators/takeUntil) operator.

> Lets values pass until a second Observable, notifier, emits a value. Then, it completes.

At first, I'd like to mention the dangers as described in this article: [RxJS: Avoiding takeUntil Leaks](https://ncjamieson.com/avoiding-takeuntil-leaks/). `takeUntil` operator has to be (usually) the last operator in the `pipe`.

> If the `takeUntil` operator is placed before an operator that involves a subscription to another observable source, the subscription to that source might not be unsubscribed when `takeUntil` receives its notification.

[Live Example](https://stackblitz.com/github/theoklitosBam7/ng-unsubscribe-examples/tree/4-takeuntil)

```ts title="first.component.ts"
export class FirstComponent implements OnInit, OnDestroy {
  ...
  // highlight-next-line
  private destroy$ = new Subject<void>();

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.timer1$
    // highlight-next-line
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (val) => this.messageService.add(`FirstComponent timer1$: ${val}`),
        (err) => console.error(err),
        () => this.messageService.add(`>>> FirstComponent timer1$ completed`)
      );

    this.timer2$
    // highlight-next-line
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (val) => this.messageService.add(`FirstComponent timer2$: ${val}`),
        (err) => console.error(err),
        () => this.messageService.add(`>>> FirstComponent timer2$ completed`)
      );
  }

  ngOnDestroy(): void {
    // highlight-start
    this.destroy$.next();
    this.destroy$.complete();
    // highlight-end
  }
}
```

Here, `destroy$` is our second `Observable` (notifier), which emits inside `ngOnDestroy()` lifecycle hook, triggered that way the completion of our data streams. An advantage to this approach is it actually completes the observable and so the `complete()` callback is called. When we call `.unsubscribe()` there’s no way we’ll be notified that the unsubscription happened.

![memory-leaks-3](https://tb-projphotos.netlify.app/avoid-memory-leaks-angular/memory-leaks-3.gif)

### The Drawback

All the above solutions actually solve our problem, however they all have at least one drawback: we have to repeat ourselves in each component by implementing `ngOnDestroy()` for our purpose. Is there any better way to reduce boilerplate furthermore? Yes, we'll take advantage of `takeUntil` and [Angular's DI mechanism](https://angular.io/guide/dependency-injection).

## The DestroyService

[Live Example](https://stackblitz.com/github/theoklitosBam7/ng-unsubscribe-examples/tree/5-destroy-service)

First, we'll move the `ngOnDestroy()` into a service:

```ts title="destroy.service.ts"
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class DestroyService extends Subject<void> implements OnDestroy {
  ngOnDestroy() {
    this.next();
    this.complete();
  }
}
```

The `FirstComponent` both provides the instance of the service (through the providers metadata array) and injects that instance into itself through its constructor:

```ts title="first.component.ts"
@Component({
  selector: 'app-first',
  template: `<p>first component works!</p>`,
  // highlight-next-line
  providers: [DestroyService],
})
export class FirstComponent implements OnInit {
  ...

  constructor(
    private messageService: MessageService,
    // highlight-next-line
    private readonly destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    ...
  }
}
```

We have the exact same result as the previous one! We can provide an instance of `DestroyService` in any component that needs it.

## Conclusions

Eventually, I think that the preferable way to manage our RxJS subscriptions is by using `takeUntil` operator via an Angular service. Some benefits are:

- Less code
- Fires a completion event when we kill our stream
- Less chance to forget `.unsubscribe()` or `.next()`, `.complete()` methods in the `ngOnDestroy()` implementation

GitHub repo with the examples is available [here](https://github.com/theoklitosBam7/ng-unsubscribe-examples).
