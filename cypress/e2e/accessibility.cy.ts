describe("Accessibility", () => {
  it("has ARIA live region on read page", () => {
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.get('[aria-live="polite"]').should("exist");
    cy.get('[aria-live="polite"]').should("have.attr", "aria-atomic", "true");
  });

  it("canvas has aria-label and role", () => {
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.get("canvas").should("have.attr", "aria-label").and("contain", "PDF page");
    cy.get("canvas").should("have.attr", "role", "img");
  });

  it("sidebar has proper ARIA attributes", () => {
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.get('[aria-label="Toggle sidebar"]').click();
    cy.get('[aria-label="Navigation sidebar"]').should("have.attr", "role", "dialog");
    cy.get('[role="tablist"]').should("have.attr", "aria-label", "Sidebar tabs");
  });

  it("toolbar buttons have aria-labels", () => {
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.get('[aria-label="Close PDF"]').should("exist");
    cy.get('[aria-label="Toggle sidebar"]').should("exist");
    cy.get('[aria-label="Previous page"]').should("exist");
    cy.get('[aria-label="Next page"]').should("exist");
    cy.get('[aria-label="Zoom out"]').should("exist");
    cy.get('[aria-label="Zoom in"]').should("exist");
  });

  it("page input has aria-label", () => {
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.get('input[aria-label="Current page number"]').should("exist");
  });

  it("sr-only class is present for screen readers", () => {
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.get('[aria-live="polite"].sr-only').should("exist");
  });
});
