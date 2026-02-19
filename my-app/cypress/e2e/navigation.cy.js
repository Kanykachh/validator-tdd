describe('Scénarios de navigation E2E', () => {

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  it('Scénario Nominal : inscription valide, le compteur et la liste se mettent à jour', () => {
    // 1. Navigation vers l'Accueil → Vérifier "0 utilisateur inscrit" et liste vide
    cy.visit('/')
    cy.get('[data-cy=user-count]').should('contain', '0 utilisateur inscrit')
    cy.get('[data-cy=user-list]').should('not.exist')

    // 2. Clic/Navigation vers le Formulaire (/register)
    cy.get('[data-cy=link-register]').click()
    cy.url().should('include', '/register')

    // 3. Ajout d'un nouvel utilisateur valide (Succès)
    cy.get('[data-cy=firstName]').type('Kany')
    cy.get('[data-cy=lastName]').type('Chheng')
    cy.get('[data-cy=email]').type('kany@test.com')
    cy.get('[data-cy=birthDate]').type('1998-03-22')
    cy.get('[data-cy=city]').type('Paris')
    cy.get('[data-cy=postalCode]').type('75015')

    cy.get('[data-cy=submit]').should('not.be.disabled')
    cy.get('[data-cy=submit]').click()

    cy.get('[data-cy=success]').should('contain', 'Inscription enregistrée')

    // 4. Redirection ou Navigation vers l'Accueil
    cy.get('[data-cy=link-home]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    // 5. Vérifier "1 utilisateur inscrit" ET la présence du nouvel utilisateur dans la liste
    cy.get('[data-cy=user-count]').should('contain', '1 utilisateur(s) inscrit(s)')
    cy.get('[data-cy=user-list]').should('exist')
    cy.get('[data-cy=user-firstName-0]').should('contain', 'Kany')
    cy.get('[data-cy=user-lastName-0]').should('contain', 'Chheng')
  })

  it('Scénario Erreur : inscription invalide, le compteur et la liste restent inchangés', () => {
    // Partant de l'état précédent (1 inscrit)
    cy.window().then((win) => {
      win.localStorage.setItem('users', JSON.stringify([
        { firstName: 'Kany', lastName: 'Chheng', email: 'kany@test.com', birthDate: '1998-03-22', city: 'Paris', postalCode: '75015' }
      ]))
    })

    // 1. Navigation vers la page → "1 utilisateur inscrit" avec Kany dans la liste
    cy.visit('/')
    cy.get('[data-cy=user-count]').should('contain', '1 utilisateur(s) inscrit(s)')
    cy.get('[data-cy=user-firstName-0]').should('contain', 'Kany')

    // 2. Navigation vers le Formulaire
    cy.get('[data-cy=link-register]').click()
    cy.url().should('include', '/register')

    // 3. Tentative d'ajout invalide (champs vides) → Vérifier l'erreur affichée
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

    // 4. Retour vers l'Accueil
    cy.visit('/')

    // 5. Vérifier "Toujours 1 utilisateur inscrit" et la liste inchangée
    cy.get('[data-cy=user-count]').should('contain', '1 utilisateur(s) inscrit(s)')
    cy.get('[data-cy=user-firstName-0]').should('contain', 'Kany')
    cy.get('[data-cy=user-lastName-0]').should('contain', 'Chheng')
  })
})
