type QuizQuestion = {
  answer: number;
  explain: string;
  options: string[];
  question: string;
};

type QuizData = {
  questions: QuizQuestion[];
  title?: string;
};

const quizDataCache = new WeakMap<HTMLElement, QuizData>();
let quizCounter = 0;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isQuizData = (value: unknown): value is QuizData => {
  if (!isRecord(value) || !Array.isArray(value.questions)) {
    return false;
  }

  return value.questions.every((question) => {
    if (!isRecord(question)) {
      return false;
    }

    const answer = question.answer;

    if (
      typeof question.question !== "string" ||
      typeof question.explain !== "string" ||
      !Array.isArray(question.options) ||
      typeof answer !== "number" ||
      !Number.isInteger(answer)
    ) {
      return false;
    }

    return (
      question.options.length > 1 &&
      question.options.every((option) => typeof option === "string") &&
      answer >= 0 &&
      answer < question.options.length
    );
  });
};

const getQuizData = (root: HTMLElement): QuizData | undefined => {
  const cachedData = quizDataCache.get(root);

  if (cachedData) {
    return cachedData;
  }

  const dataScript = root.querySelector<HTMLScriptElement>(
    'script[type="application/json"]',
  );

  if (!dataScript) {
    return undefined;
  }

  try {
    const parsedData: unknown = JSON.parse(dataScript.textContent ?? "");

    if (!isQuizData(parsedData)) {
      throw new Error("invalid quiz data");
    }

    quizDataCache.set(root, parsedData);
    return parsedData;
  } catch {
    return undefined;
  }
};

const shuffle = (values: number[]) => {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }

  return values;
};

const addOptionState = (label: HTMLLabelElement, text: string) => {
  const state = document.createElement("span");
  state.className = "lesson-quiz-option-state";
  state.textContent = text;
  label.append(state);
};

const renderQuiz = (root: HTMLElement, data: QuizData, quizId: string) => {
  root.replaceChildren();

  const title = document.createElement("h3");
  title.className = "lesson-quiz-title";
  title.id = `${quizId}-title`;
  title.tabIndex = -1;
  title.textContent = data.title ?? "Check yourself";
  root.setAttribute("aria-labelledby", title.id);
  root.append(title);

  const score = document.createElement("p");
  score.className = "lesson-quiz-score";
  score.hidden = true;
  score.setAttribute("aria-atomic", "true");
  score.setAttribute("aria-live", "polite");
  score.setAttribute("role", "status");

  const answeredQuestions = new Set<number>();
  let correctAnswers = 0;

  data.questions.forEach((question, questionIndex) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "lesson-quiz-question";
    fieldset.dataset.quizQuestion = String(questionIndex);

    const legend = document.createElement("legend");
    legend.className = "lesson-quiz-question-text";
    legend.textContent = `${questionIndex + 1}. ${question.question}`;
    fieldset.append(legend);

    const feedback = document.createElement("p");
    feedback.className = "lesson-quiz-feedback";
    feedback.id = `${quizId}-feedback-${questionIndex}`;
    feedback.hidden = true;
    feedback.setAttribute("aria-atomic", "true");
    feedback.setAttribute("aria-live", "polite");
    feedback.setAttribute("role", "status");
    fieldset.setAttribute("aria-describedby", feedback.id);

    shuffle(question.options.map((_, optionIndex) => optionIndex)).forEach(
      (optionIndex) => {
        const label = document.createElement("label");
        label.className = "lesson-quiz-option";

        const input = document.createElement("input");
        input.name = `${quizId}-question-${questionIndex}`;
        input.type = "radio";
        input.value = String(optionIndex);

        const optionText = document.createElement("span");
        optionText.textContent = question.options[optionIndex];

        label.append(input, optionText);

        input.addEventListener("change", () => {
          if (answeredQuestions.has(questionIndex)) {
            return;
          }

          answeredQuestions.add(questionIndex);
          const chosenCorrectly = optionIndex === question.answer;

          if (chosenCorrectly) {
            correctAnswers += 1;
          }

          fieldset
            .querySelectorAll<HTMLInputElement>('input[type="radio"]')
            .forEach((questionInput) => {
              questionInput.disabled = true;
              const questionLabel = questionInput.closest("label");

              if (!questionLabel) {
                return;
              }

              const value = Number(questionInput.value);
              questionLabel.classList.add("is-locked");

              if (value === question.answer) {
                questionLabel.classList.add("is-correct");
                addOptionState(questionLabel, "Correct answer");
              } else if (value === optionIndex) {
                questionLabel.classList.add("is-incorrect");
                addOptionState(questionLabel, "Your answer. Incorrect.");
              }
            });

          fieldset.classList.add(
            "is-answered",
            chosenCorrectly ? "is-correct" : "is-incorrect",
          );
          feedback.hidden = false;
          feedback.textContent = chosenCorrectly
            ? `Correct. ${question.explain}`
            : `Not quite. The correct answer is "${question.options[question.answer]}". ${question.explain}`;

          if (answeredQuestions.size === data.questions.length) {
            score.hidden = false;
            score.textContent =
              `You scored ${correctAnswers} of ${data.questions.length}. ` +
              (correctAnswers === data.questions.length
                ? "Clean sweep. Now try the retrieval prompts without looking."
                : "Read the explanations again, then retry from memory.");
          }
        });

        fieldset.append(label);
      },
    );

    fieldset.append(feedback);
    root.append(fieldset);
  });

  root.append(score);

  if (data.questions.length > 0) {
    const retry = document.createElement("button");
    retry.className = "lesson-quiz-retry";
    retry.type = "button";
    retry.textContent = "Retry from scratch";
    retry.addEventListener("click", () => {
      renderQuiz(root, data, quizId);
      root.querySelector<HTMLElement>(`.${title.className}`)?.focus();
    });
    root.append(retry);
  }
};

const initializeQuiz = (page: HTMLElement) => {
  page.querySelectorAll<HTMLElement>("[data-lesson-quiz]").forEach((root) => {
    const data = getQuizData(root);

    if (!data) {
      const error = document.createElement("p");
      error.className = "lesson-quiz-error";
      error.setAttribute("role", "alert");
      error.textContent = "This quiz is temporarily unavailable.";
      root.replaceChildren(error);
      return;
    }

    const quizId = root.dataset.quizId ?? `lesson-quiz-${++quizCounter}`;
    root.dataset.quizId = quizId;
    renderQuiz(root, data, quizId);
  });
};

const initializeCompletion = (page: HTMLElement) => {
  const root = page.querySelector<HTMLElement>("[data-lesson-completion]");
  const button = root?.querySelector<HTMLButtonElement>(
    "[data-lesson-completion-toggle]",
  );
  const label = button?.querySelector<HTMLElement>(
    "[data-lesson-completion-label]",
  );
  const status = root?.querySelector<HTMLElement>(
    "[data-lesson-completion-status]",
  );

  if (!root || !button || !status) {
    return;
  }

  const storageKey = `lesson-completion:${page.dataset.course ?? "unknown"}:${page.dataset.lesson ?? "unknown"}`;
  let isComplete = false;
  let persistenceAvailable = true;

  try {
    isComplete = window.localStorage.getItem(storageKey) === "complete";
  } catch {
    persistenceAvailable = false;
  }

  const update = () => {
    button.setAttribute("aria-pressed", String(isComplete));
    button.classList.toggle("is-complete", isComplete);

    if (label) {
      label.textContent = isComplete
        ? "Mark lesson incomplete"
        : "Mark lesson complete";
    }

    status.textContent = isComplete
      ? persistenceAvailable
        ? "This lesson is marked complete in this browser."
        : "This lesson is marked complete for this visit. Browser storage is unavailable."
      : persistenceAvailable
        ? "Not marked complete. This setting stays in this browser."
        : "Not marked complete. Browser storage is unavailable, but this control still works for this visit.";
  };

  button.addEventListener("click", () => {
    isComplete = !isComplete;

    try {
      if (isComplete) {
        window.localStorage.setItem(storageKey, "complete");
      } else {
        window.localStorage.removeItem(storageKey);
      }
      persistenceAvailable = true;
    } catch {
      persistenceAvailable = false;
    }

    update();
  });

  update();
};

export const initializeLessonInteractions = () => {
  document
    .querySelectorAll<HTMLElement>("[data-lesson-page]")
    .forEach((page) => {
      initializeQuiz(page);
      initializeCompletion(page);
    });
};
