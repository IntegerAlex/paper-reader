describe("PWA & Offline", () => {
  it("has manifest.json", () => {
    cy.request("/manifest.json").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("short_name");
      expect(response.body).to.have.property("start_url");
    });
  });

  it("has service worker file", () => {
    cy.request("/sw.js").then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("has proper meta tags", () => {
    cy.visit("/");
    cy.get('meta[name="theme-color"]').should("exist");
    cy.get('meta[name="mobile-web-app-capable"]').should("have.attr", "content", "yes");
    cy.get('link[rel="manifest"]').should("have.attr", "href", "/manifest.json");
  });
});
