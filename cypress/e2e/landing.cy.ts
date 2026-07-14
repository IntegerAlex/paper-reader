describe("Landing Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads and displays hero section", () => {
    cy.contains("Paper Reader").should("be.visible");
    cy.contains("Reading").should("be.visible");
    cy.contains("feels").should("be.visible");
    cy.contains("like paper").should("be.visible");
  });

  it("shows hero description", () => {
    cy.contains("premium PDF reader").should("be.visible");
    cy.contains("textured paper").should("be.visible");
  });

  it("has Start Reading link", () => {
    cy.contains("a", "Start Reading").should("have.attr", "href", "/read");
  });

  it("has Explore Textures link", () => {
    cy.contains("a", "Explore Textures").should("have.attr", "href", "#textures");
  });

  it("navigates to read page", () => {
    cy.contains("a", "Start Reading").click();
    cy.url().should("include", "/read");
  });

  it("shows texture gallery section", () => {
    cy.contains("Nine artisan textures").should("be.visible");
    cy.contains("Classic Matte").should("be.visible");
    cy.contains("Whisper Weave").should("be.visible");
    cy.contains("Sunbaked Parchment").should("be.visible");
    cy.contains("Saddle Linen").should("be.visible");
    cy.contains("Painter's Press").should("be.visible");
    cy.contains("Mulberry Veil").should("be.visible");
  });

  it("shows design principles section", () => {
    cy.contains("Design principles").should("be.visible");
    cy.contains("Procedural, not photographic").should("be.visible");
    cy.contains("Physical depth cues").should("be.visible");
    cy.contains("Calm, not clever").should("be.visible");
    cy.contains("Responsive texture").should("be.visible");
  });

  it("shows science section", () => {
    cy.contains("science of comfortable reading").should("be.visible");
    cy.contains("Reduced Glare").should("be.visible");
    cy.contains("Warm Tones").should("be.visible");
    cy.contains("Visual Depth").should("be.visible");
  });

  it("shows CTA section", () => {
    cy.contains("Ready to read differently").should("be.visible");
    cy.contains("a", "Open Paper Reader").should("have.attr", "href", "/read");
  });

  it("shows footer", () => {
    cy.contains("Procedural textures").should("be.visible");
    cy.contains("No tracking").should("be.visible");
    cy.contains("Open source").should("be.visible");
  });

  it("hovering texture card updates preview", () => {
    cy.contains("Classic Matte").parent().parent().parent().trigger("mouseenter");
    cy.contains("Classic Matte").should("be.visible");
  });
});
