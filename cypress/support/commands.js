'use strict';

/**
 * Logs in to the application.
 * @param user username
 * @param password password
 * Steps:
 * 1. Navigates to base url
 * 2. Submits login request with provided credentials
 * 3. Waits for the page to be fully loaded by checking Log In button abscence
 */
Cypress.Commands.add('login', (user, password) => {
  cy.visit('/');
  cy.window().then((window) => {
    window.app.session
        .login({identification: user, password: password, remember: false})
        .then(() => window.location.reload());
  });
  cy.get('.item-logIn')
      .should('not.exist');
});
