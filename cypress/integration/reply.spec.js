'use strict';
/// <reference types="Cypress" />

context('Reply', () => {
  beforeEach(() => {
    cy.fixture('credentials').then((credentials) => {
      cy.login(credentials.user, credentials.password);
    });
  });

  it('Post a reply', () => {
    cy.fixture('reply').then((reply) => {
      const comment = reply.message + Date.now();

      cy.visit(`/t/sandbox`);

      cy.request('/api/discussions?filter[q]=tag:sandbox&page[limit]=50')
          .then((response) => {
            return response.body.data;
          }).as('discussionsArray');

      cy.get('@discussionsArray').then((discussionsArray) => {
        for (const discussion of discussionsArray) {
          if (discussion.attributes.title === reply.discussionToReply) {
            cy.visit(`/d/${discussion.id}-${discussion.attributes.slug}`);
            break;
          }
        }
      });

      cy.get('.SplitDropdown-button')
          .click();
      cy.get('#textarea1')
          .type(comment);
      cy.get('.item-submit > .Button')
          .click();
      cy.reload();
      cy.get('.CommentPost')
          .last()
          .should('contain', comment);
    });
  });
});
