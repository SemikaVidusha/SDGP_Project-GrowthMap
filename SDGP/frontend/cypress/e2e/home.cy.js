describe('Home Page', () => {
  it('loads successfully', () => {
    cy.visit('http://localhost:5173');
    cy.contains('GrowthMap');
  });

  it('navigates to profile page', () => {
    cy.visit('http://localhost:5173');

    cy.get('div.fixed.inset-0').should('not.be.visible');

    cy.contains('Explore Careers', { timeout: 10000 })
  .should('be.visible')
  .click();
  });
});