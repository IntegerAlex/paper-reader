describe("PDF Upload", () => {
  beforeEach(() => {
    cy.visit("/read");
  });

  it("shows upload screen when no PDF loaded", () => {
    cy.contains("Paper Reader").should("be.visible");
    cy.contains("Drop a PDF here or click to open").should("be.visible");
    cy.contains("Choose PDF").should("be.visible");
  });

  it("has file input for PDF", () => {
    cy.get('input[type="file"]').should("exist").and("have.attr", "accept", ".pdf");
  });

  it("uploads PDF via file input", () => {
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.get("canvas").should("be.visible");
  });

  it("shows page count after upload", () => {
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.contains("1 / 3").should("be.visible");
  });

  it("shows document name in toolbar", () => {
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.contains("test.pdf").should("be.visible");
  });
});
