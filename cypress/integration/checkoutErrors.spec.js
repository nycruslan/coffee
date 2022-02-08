describe('Checkout Errors', () => {
  it('Shows an error when the order fails', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'error').as('consoleError');
      },
    });
    cy.findByRole('link', { name: /Apple/ }).click();
    cy.findByRole('button', { name: 'Add to Cart' }).click();
    cy.findByRole('link', { name: 'Cart 1' }).click();
    cy.findByLabelText(/Name/).type('Big Nerd Ranch');
    cy.findByLabelText(/Zip Code/).type('99999');
    cy.findByRole('button', { name: 'Place Order' }).click();
    cy.findByText(/There was an error/);
    cy.findByText(/We don't ship to 99999/i);
    cy.findByRole('button', { name: 'Ok' }).click();
    cy.findByText(/There was an error/).should('not.exist');
    cy.findByRole('button', { name: 'Place Order' }).should('be.enabled');
    cy.get('@consoleError').should('be.calledOnce');
  });
});
