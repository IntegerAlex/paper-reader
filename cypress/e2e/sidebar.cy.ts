describe("Sidebar", () => {
  beforeEach(() => {
    cy.visit("/read");
    cy.uploadPDF("test.pdf");
    cy.waitForPDF();
    cy.get('[aria-label="Toggle sidebar"]').click();
    cy.get('[aria-label="Navigation sidebar"]').should("be.visible");
  });

  it("opens sidebar with tabs", () => {
    cy.get('[role="tablist"]').should("be.visible");
    cy.get('[role="tab"]').should("have.length", 5);
  });

  it("shows thumbnails tab by default", () => {
    cy.get('[role="tabpanel"][aria-label="Page thumbnails"]').should("exist");
  });

  it("switches to bookmarks tab", () => {
    cy.get('[role="tab"]').contains("Bookmarks").click();
    cy.get('[role="tabpanel"][aria-label="Bookmarks"]').should("exist");
  });

  it("switches to table of contents tab", () => {
    cy.get('[role="tab"]').contains("Contents").click();
    cy.get('[role="tabpanel"][aria-label="Table of contents"]').should("exist");
  });

  it("switches to search tab", () => {
    cy.get('[role="tab"]').contains("Search").click();
    cy.get('[role="tabpanel"][aria-label="Search document"]').should("exist");
  });

  it("switches to annotations tab", () => {
    cy.get('[role="tab"]').contains("Notes").click();
    cy.get('[role="tabpanel"][aria-label="Annotations"]').should("exist");
  });

  it("close button closes sidebar", () => {
    cy.get('[aria-label="Close sidebar"]').click();
    cy.get('[aria-label="Navigation sidebar"]').should("not.exist");
  });
});
