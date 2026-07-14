describe("Toolbar", () => {
  beforeEach(() => {
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
  });

  it("shows toolbar with all controls", () => {
    cy.get('[aria-label="Close PDF"]').should("be.visible");
    cy.get('[aria-label="Toggle sidebar"]').should("be.visible");
    cy.get('[aria-label="Previous page"]').should("be.visible");
    cy.get('[aria-label="Next page"]').should("be.visible");
    cy.get('[aria-label="Zoom out"]').should("be.visible");
    cy.get('[aria-label="Zoom in"]').should("be.visible");
    cy.get('[title="Paper texture"]').should("be.visible");
    cy.get('[title="Focus mode (D)"]').should("be.visible");
    cy.get('[title="Fullscreen (F)"]').should("be.visible");
  });

  it("navigates pages via toolbar buttons", () => {
    cy.get('[aria-label="Next page"]').click();
    cy.contains("2 / 3").should("be.visible");
    cy.get('[aria-label="Previous page"]').click();
    cy.contains("1 / 3").should("be.visible");
  });

  it("zooms via toolbar buttons", () => {
    cy.get('[aria-label="Zoom in"]').click();
    cy.contains("175%").should("be.visible");
    cy.get('[aria-label="Zoom out"]').click();
    cy.contains("150%").should("be.visible");
  });

  it("opens texture picker", () => {
    cy.get('[title="Paper texture"]').click();
    cy.contains("Texture").should("be.visible");
  });

  it("closes PDF with close button", () => {
    cy.get('[aria-label="Close PDF"]').click();
    cy.contains("Choose PDF").should("be.visible");
  });

  it("toggles sidebar", () => {
    cy.get('[aria-label="Toggle sidebar"]').click();
    cy.get('[aria-label="Navigation sidebar"]').should("be.visible");
    cy.get('[aria-label="Close sidebar"]').click();
    cy.get('[aria-label="Navigation sidebar"]').should("not.exist");
  });

  it("keyboard shortcut T toggles sidebar", () => {
    cy.get("body").type("t");
    cy.get('[aria-label="Navigation sidebar"]').should("be.visible");
    cy.get("body").type("t");
    cy.get('[aria-label="Navigation sidebar"]').should("not.exist");
  });

  it("keyboard shortcut B toggles bookmark", () => {
    cy.get("body").type("b");
    cy.wait(300);
    cy.get(".glass-toolbar").should("be.visible");
    cy.get(".glass-toolbar span").should("have.length.greaterThan", 0);
    cy.get("body").type("b");
  });

  it("Escape closes sidebar", () => {
    cy.get('[aria-label="Toggle sidebar"]').click();
    cy.get('[aria-label="Navigation sidebar"]').should("be.visible");
    cy.get("body").type("{esc}");
    cy.get('[aria-label="Navigation sidebar"]').should("not.exist");
  });
});
