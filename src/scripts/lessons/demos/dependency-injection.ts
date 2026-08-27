type PriceTransport = (id: string) => Promise<number>;

const fakePrices: Record<string, number> = {
  "p-007": 499,
  "p-042": 1290,
};
let demoCounter = 0;
const initializedDemoRoots = new WeakSet<HTMLElement>();

class PriceService {
  constructor(private readonly fetchPrice: PriceTransport) {}

  loadPrice(productId: string): Promise<number> {
    return this.fetchPrice(productId);
  }
}

const fakeTransport: PriceTransport = async (id) => fakePrices[id] ?? 0;

const simulatedNetworkTransport: PriceTransport = async () => {
  throw new Error("network unavailable (simulated; no request sent)");
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message || "unknown error"}`;
  }

  return String(error);
};

export const initializeDependencyInjectionDemo = (lessonRoot: HTMLElement) => {
  lessonRoot
    .querySelectorAll<HTMLElement>(
      '[data-lesson-demo][data-demo-kind="dependency-injection"]',
    )
    .forEach((root) => {
      if (initializedDemoRoots.has(root)) {
        return;
      }

      const output = root.querySelector<HTMLElement>("[data-demo-output]");
      const buttons = Array.from(
        root.querySelectorAll<HTMLButtonElement>("[data-demo-action]"),
      );

      if (!output || buttons.length === 0) {
        return;
      }

      initializedDemoRoots.add(root);

      const networkButton = root.querySelector<HTMLButtonElement>(
        '[data-demo-action="network"]',
      );
      const networkNote = root.querySelector<HTMLElement>(
        "[data-demo-network-note]",
      );

      if (networkButton && networkNote) {
        const noteId = networkNote.id || `lesson-demo-note-${++demoCounter}`;
        networkNote.id = noteId;
        networkButton.setAttribute("aria-describedby", noteId);
      }

      let isRunning = false;

      buttons.forEach((button) => {
        button.addEventListener("click", async () => {
          const action = button.dataset.demoAction;

          if (isRunning || (action !== "fake" && action !== "network")) {
            return;
          }

          isRunning = true;
          buttons.forEach((demoButton) => {
            demoButton.disabled = true;
          });

          const usingFake = action === "fake";
          const transport = usingFake
            ? fakeTransport
            : simulatedNetworkTransport;
          const service = new PriceService(transport);
          const transportName = usingFake
            ? "fakeTransport"
            : "realTransport (simulated)";
          const lines = [
            `$ new PriceService(${transportName})`,
            "$ service.loadPrice('p-042')",
          ];

          output.textContent = lines.join("\n");

          try {
            const price = await service.loadPrice("p-042");
            output.textContent = `${lines.join("\n")}\nprice: $${price}${
              usingFake
                ? "\nNo network request."
                : "\nNo network request; failure was simulated."
            }`;
          } catch (error) {
            output.textContent = `${lines.join("\n")}\n! ${getErrorMessage(
              error,
            )}. The class and the network fail together.`;
          } finally {
            isRunning = false;
            buttons.forEach((demoButton) => {
              demoButton.disabled = false;
            });
          }
        });
      });
    });
};
