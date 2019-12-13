'use strict';
/// <reference types="Cypress" />

context('Profile', () => {
  beforeEach(() => {
    cy.fixture('credentials').then((credentials) => {
      cy.login(credentials.user, credentials.password);
    });
  });

  it('Change user profile on front-end only', () => {
    cy.fixture('stubbedResponse').then((stubbedResponse) => {
      const stubbedBio = stubbedResponse.data.attributes.bio;

      cy.fixture('credentials').then((credentials) => {
        cy.server();
        cy.route('/api/posts*').as('getDetails');
        cy.route('POST', '/api/users/*', stubbedResponse).as('stubbedPost');

        cy.visit(`/u/${credentials.user}`);

        cy.wait('@getDetails').then((response) => {
          response.response.body.included[0].attributes.bio = stubbedBio;
          return response.response.body;
        }).as('stubbedDetails');

        cy.get('.UserBio-content')
            .click();
        cy.get('.UserBio > .FormControl')
            .clear()
            .type(stubbedBio)
            .type('{enter}');
        cy.wait('@stubbedPost')
            .then((request) => {
              expect(request.requestBody.data.attributes.bio).to.eq(stubbedBio);
            });

        cy.visit('/');
        cy.route('GET', '/api/posts*', '@stubbedDetails')
            .as('stubbedGet');

        cy.visit(`/u/${credentials.user}`);

        cy.wait('@stubbedGet');
        cy.get('.UserBio-content')
            .should('contain', stubbedBio);
      });
    });
  });
});
