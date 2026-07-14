Cypress.Commands.add("uploadPDF", (filename = "test.pdf") => {
  cy.get('input[type="file"]').selectFile(`cypress/fixtures/${filename}`, { force: true });
});

Cypress.Commands.add("waitForPDF", () => {
  cy.get("canvas", { timeout: 15000 }).should("be.visible");
  cy.get(".textLayer", { timeout: 10000 }).should("exist");
  cy.wait(2000);
});

Cypress.Commands.add("selectText", () => {
  // Create selection and trigger mouseup in one cy.then block
  // so React's batched updates process the state change
  cy.window().then((win) => {
    const spans = win.document.querySelectorAll(".textLayer span");
    if (spans.length === 0) return false;

    const range = win.document.createRange();
    range.selectNodeContents(spans[0]);
    const sel = win.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    // Verify selection was created
    const selectedText = sel?.toString()?.trim();
    if (!selectedText) return false;

    // Dispatch mouseup on the wrapper - find it relative to the canvas
    const canvas = win.document.querySelector("canvas");
    if (!canvas) return false;

    // Walk up from canvas to find the wrapper div with onMouseUp
    // It's the grandparent of PaperSheet's content div
    let el: HTMLElement | null = canvas;
    while (el) {
      if (el.classList.contains("relative") && el.classList.contains("max-w-full")) {
        const rect = el.getBoundingClientRect();
        const mouseUpEvent = new MouseEvent("mouseup", {
          bubbles: true,
          cancelable: true,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        });
        el.dispatchEvent(mouseUpEvent);
        return true;
      }
      el = el.parentElement;
    }
    return false;
  });
  cy.wait(500);
});

Cypress.Commands.add("getSelectionToolbar", () => {
  return cy.get("[data-sel-toolbar]");
});

Cypress.Commands.add("getAnnotationOverlays", () => {
  return cy.get("[data-annotation-overlay]");
});
