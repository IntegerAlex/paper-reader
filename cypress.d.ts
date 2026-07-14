declare namespace Cypress {
  interface Chainable<Subject = any> {
    uploadPDF(filename?: string): Chainable<void>;
    waitForPDF(): Chainable<void>;
    selectText(): Chainable<boolean>;
    getSelectionToolbar(): Chainable<JQuery<HTMLElement>>;
    getAnnotationOverlays(): Chainable<JQuery<HTMLElement>>;
  }
}
