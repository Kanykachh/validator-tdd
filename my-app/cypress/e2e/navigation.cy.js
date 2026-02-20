const API_URL = 'https://jsonplaceholder.typicode.com';

describe('Scénarios de navigation E2E', () => {

  beforeEach(() => {
    cy.intercept('GET', `${API_URL}/users`, []).as('getUsers')
    cy.intercept('POST', `${API_URL}/users`, { id: 11 }).as('createUser')
  })

  it('Scénario Nominal : inscription valide, le compteur et la liste se mettent à jour', () => {
    cy.visit('/')
    cy.wait('@getUsers')

    cy.get('[data-cy=user-count]').should('contain', '0 utilisateur inscrit')
    cy.get('[data-cy=user-list]').should('not.exist')

    cy.get('[data-cy=link-register]').click()
    cy.url().should('include', '/register')

    cy.get('[data-cy=firstName]').type('Kany')
    cy.get('[data-cy=lastName]').type('Chheng')
    cy.get('[data-cy=email]').type('kany@test.com')
    cy.get('[data-cy=birthDate]').type('1998-03-22')
    cy.get('[data-cy=city]').type('Paris')
    cy.get('[data-cy=postalCode]').type('75015')

    cy.get('[data-cy=submit]').should('not.be.disabled')
    cy.get('[data-cy=submit]').click()

    cy.wait('@createUser')
    cy.get('[data-cy=success]').should('contain', 'Inscription enregistrée')

    cy.get('[data-cy=link-home]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.get('[data-cy=user-count]').should('contain', '1 utilisateur(s) inscrit(s)')
    cy.get('[data-cy=user-list]').should('exist')
    cy.get('[data-cy=user-firstName-0]').should('contain', 'Kany')
    cy.get('[data-cy=user-lastName-0]').should('contain', 'Chheng')
  })

  it('Scénario Erreur : inscription invalide, le compteur et la liste restent inchangés', () => {
    cy.intercept('GET', `${API_URL}/users`, [
      { id: 1, firstName: 'Kany', lastName: 'Chheng', email: 'kany@test.com' }
    ]).as('getUsersWithOne')

    cy.visit('/')
    cy.wait('@getUsersWithOne')

    cy.get('[data-cy=user-count]').should('contain', '1 utilisateur(s) inscrit(s)')
    cy.get('[data-cy=user-firstName-0]').should('contain', 'Kany')

    cy.get('[data-cy=link-register]').click()
    cy.url().should('include', '/register')

    cy.get('[data-cy=firstName]').type('Lucas')
    cy.get('[data-cy=lastName]').type('Petit')
    cy.get('[data-cy=email]').type('lucas@test.com')
    cy.get('[data-cy=birthDate]').type('2015-01-01')
    cy.get('[data-cy=city]').type('Lyon')
    cy.get('[data-cy=postalCode]').type('69001')

    cy.get('[data-cy=submit]').should('be.disabled')
    cy.get('[data-cy=birthDate]').blur()
    cy.get('[data-cy=error-birthDate]').should('contain', 'Vous devez avoir au moins 18 ans')

    cy.get('[data-cy=success]').should('not.exist')

    cy.visit('/')
    cy.wait('@getUsers')

    cy.get('[data-cy=user-count]').should('contain', '0 utilisateur inscrit')
  })
})
