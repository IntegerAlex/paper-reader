describe("Annotations", () => {
  const ANNS_KEY = "paper-reader:annotations:test.pdf";

  function injectAnnotation(annotation: object[]) {
    cy.window().then((win) => {
      win.localStorage.setItem(ANNS_KEY, JSON.stringify(annotation));
    });
  }

  function makeAnnotation(id: string, yPct: number, note?: string) {
    return [{
      id,
      page: 1,
      type: "highlight",
      color: "#c4981a",
      text: `Test ${id}`,
      rects: [{ xPct: 0.12, yPct, wPct: 0.4, hPct: 0.025 }],
      pageWidth: 612,
      pageHeight: 792,
      ...(note ? { note } : {}),
      createdAt: Date.now(),
    }];
  }

  it("renders annotation overlays from localStorage", () => {
    injectAnnotation(makeAnnotation("a1", 0.12));
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.getAnnotationOverlays().should("have.length", 1);
  });

  it("opens popover on annotation click", () => {
    injectAnnotation(makeAnnotation("a2", 0.18, "My note"));
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.getAnnotationOverlays().first().click({ force: true });
    cy.get('[role="dialog"][aria-label="Edit annotation note"]').should("be.visible");
    cy.get("textarea").should("have.value", "My note");
  });

  it("saves note and closes popover", () => {
    injectAnnotation(makeAnnotation("a3", 0.24));
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.getAnnotationOverlays().first().click({ force: true });
    cy.get('[role="dialog"]').should("be.visible");
    cy.get("textarea").clear({ force: true }).type("Updated note", { force: true });
    cy.get('[role="dialog"]').contains("Save").click({ force: true });
    cy.wait(500);
    cy.get('[role="dialog"]').should("not.exist");
    cy.window().then((win) => {
      const saved = JSON.parse(win.localStorage.getItem(ANNS_KEY) || "[]");
      expect(saved[0].note).to.equal("Updated note");
    });
  });

  it("cancel closes popover without saving", () => {
    injectAnnotation(makeAnnotation("a4", 0.30, "Original"));
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.getAnnotationOverlays().first().click({ force: true });
    cy.get('[role="dialog"]').should("be.visible");
    cy.get("textarea").clear({ force: true }).type("Should not save", { force: true });
    cy.get('[role="dialog"]').contains("Cancel").click({ force: true });
    cy.get('[role="dialog"]').should("not.exist");
    cy.window().then((win) => {
      const saved = JSON.parse(win.localStorage.getItem(ANNS_KEY) || "[]");
      expect(saved[0].note).to.equal("Original");
    });
  });

  it("delete removes annotation", () => {
    injectAnnotation(makeAnnotation("a5", 0.36));
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.getAnnotationOverlays().should("have.length", 1);
    cy.getAnnotationOverlays().first().click({ force: true });
    cy.get('[role="dialog"]').should("be.visible");
    cy.get('[role="dialog"]').contains("Delete").click({ force: true });
    cy.wait(500);
    cy.getAnnotationOverlays().should("have.length", 0);
    cy.window().then((win) => {
      const saved = JSON.parse(win.localStorage.getItem(ANNS_KEY) || "[]");
      expect(saved).to.have.length(0);
    });
  });
});
