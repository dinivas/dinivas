import { getGreeting } from '../support/app.po';

describe('console', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to console!');
  });
});
