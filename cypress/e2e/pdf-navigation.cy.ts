describe("PDF Rendering & Navigation", () => {
  beforeEach(() => {
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
  });

  it("renders PDF canvas", () => {
    cy.get("canvas").should("be.visible");
  });

  it("renders text layer", () => {
    cy.get(".textLayer").should("exist");
    cy.get(".textLayer span").should("have.length.greaterThan", 0);
  });

  it("navigates to next page with keyboard", () => {
    cy.contains("1 / 3").should("be.visible");
    cy.get("body").type("{rightarrow}");
    cy.contains("2 / 3").should("be.visible");
  });

  it("navigates to previous page with keyboard", () => {
    cy.get("body").type("{rightarrow}");
    cy.contains("2 / 3").should("be.visible");
    cy.get("body").type("{leftarrow}");
    cy.contains("1 / 3").should("be.visible");
  });

  it("navigates to first page with Home key", () => {
    cy.get("body").type("{rightarrow}");
    cy.wait(300);
    cy.get("body").type("{rightarrow}");
    cy.wait(500);
    cy.get("body").type("{home}");
    cy.wait(500);
    cy.contains("1 / 3").should("be.visible");
  });

  it("navigates to last page with End key", () => {
    cy.get("body").type("{end}");
    cy.contains("3 / 3").should("be.visible");
  });

  it("zooms in with + key", () => {
    cy.contains("150%").should("be.visible");
    cy.get("body").type("+");
    cy.contains("175%").should("be.visible");
  });

  it("zooms out with - key", () => {
    cy.contains("150%").should("be.visible");
    cy.get("body").type("-");
    cy.contains("125%").should("be.visible");
  });

  it("resets zoom with 0 key", () => {
    cy.get("body").type("+");
    cy.get("body").type("+");
    cy.contains("200%").should("be.visible");
    cy.get("body").type("0");
    cy.contains("150%").should("be.visible");
  });

  it("shows page indicator at bottom", () => {
    cy.get(".glass-toolbar").should("be.visible");
    cy.contains("1 / 3").should("be.visible");
  });
});
