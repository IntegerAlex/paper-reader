describe("Theme & Textures", () => {
  beforeEach(() => {
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
  });

  it("changes texture via toolbar picker", () => {
    cy.get('[title="Paper texture"]').click();
    cy.contains("Texture").should("be.visible");
    cy.contains("Whisper").click();
    cy.wait(300);
  });

  it("shows all available textures in picker", () => {
    cy.get('[title="Paper texture"]').click();
    cy.contains("Texture").should("be.visible");
    cy.contains("Classic").should("be.visible");
    cy.contains("Whisper").should("be.visible");
    cy.contains("Sunbaked").should("be.visible");
    cy.contains("Saddle").should("be.visible");
    cy.contains("Painter").should("be.visible");
    cy.contains("Mulberry").should("be.visible");
    cy.contains("Vellum").should("be.visible");
  });
});
