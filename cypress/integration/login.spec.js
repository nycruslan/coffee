describe('Login', () => {
  it('Show Logged In User\'s Username', () => {
    cy.visit('/');
    cy.login();
    cy.findByText(/Welcome, Tester/);
  });
});
