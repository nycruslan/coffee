describe('Orders', () => {
  before(() => {
    cy.request('DELETE', '/api/orders');
  });
  it('User can build a cart and place an order', () => {
    cy.visit('/');
    cy.findByRole('link', { name: /Apple/ }).click();
    cy.findByText(/Price:/);
    cy.findByRole('button', { name: 'Add to Cart' }).click();
    cy.findByTestId('cart-quantity').should('contain', '1');
    cy.findByRole('button', { name: 'Add to Cart' }).click();
    cy.findByTestId('cart-quantity').should('contain', '2');
    cy.findByRole('link', { name: /Cart/i }).click();
    cy.findByLabelText(/Name/);
    cy.findByRole('button', { name: 'Place Order' }).should('be.disabled');
    cy.findByLabelText(/Name/).type('Big Nerd Ranch');
    cy.findByLabelText(/Zip Code/).type('30307');
    cy.findByRole('button', { name: 'Place Order' }).should('be.enabled');
    cy.findByRole('button', { name: 'Place Order' }).click();
    cy.findByText(/Thanks for your order/);
    cy.findByRole('button', { name: 'Return Home' }).click();
    cy.findAllByTestId('thumbnail-component');
  });
  it('Can View and Delete Orders', () => {
    cy.visit('/');
    cy.login();
    cy.findByRole('link', { name: 'My orders' }).click();
    cy.findByRole('button', { name: 'Delete Order' }).click();
    cy.findByText(/Are you sure you want to delete this order?/);
    cy.findByRole('button', { name: 'Cancel' }).click();
    cy.findByRole('button', { name: 'Delete Order' }).click();
    cy.findByRole('button', { name: 'Delete Forever' }).click();
    cy.findByText(/No Orders/);
  });
});
