describe('Formulaire d\'inscription', () => {

  beforeEach(() => {
    cy.visit('/register')
  })

  it('affiche le formulaire avec tous les champs', () => {
    cy.get('h1').should('contain', 'Inscription')
    cy.get('[data-cy=firstName]').should('exist')
    cy.get('[data-cy=lastName]').should('exist')
    cy.get('[data-cy=email]').should('exist')
    cy.get('[data-cy=birthDate]').should('exist')
    cy.get('[data-cy=city]').should('exist')
    cy.get('[data-cy=postalCode]').should('exist')
    cy.get('[data-cy=submit]').should('exist')
  })

  it('le bouton est desactive quand le formulaire est vide', () => {
    cy.get('[data-cy=submit]').should('be.disabled')
  })

  it('affiche une erreur si le prenom contient des chiffres', () => {
    cy.get('[data-cy=firstName]').type('Jean123').blur()
    cy.get('[data-cy=error-firstName]').should('contain', 'Le nom ne doit contenir que des lettres')
  })

  it('affiche une erreur si l\'email est invalide', () => {
    cy.get('[data-cy=email]').type('pasunmail').blur()
    cy.get('[data-cy=error-email]').should('contain', "L'email n'est pas valide")
  })

  it('affiche une erreur si le code postal est invalide', () => {
    cy.get('[data-cy=postalCode]').type('123').blur()
    cy.get('[data-cy=error-postalCode]').should('contain', 'Le code postal doit contenir 5 chiffres')
  })

  it('affiche une erreur si l\'utilisateur est mineur', () => {
    cy.get('[data-cy=birthDate]').type('2015-01-01').blur()
    cy.get('[data-cy=error-birthDate]').should('contain', 'Vous devez avoir au moins 18 ans')
  })

  it('affiche une erreur si la ville contient des chiffres', () => {
    cy.get('[data-cy=city]').type('Paris75').blur()
    cy.get('[data-cy=error-city]').should('contain', 'Nom de ville invalide')
  })

  it('inscription reussie avec des donnees valides', () => {
    cy.get('[data-cy=firstName]').type('Kany')
    cy.get('[data-cy=lastName]').type('Chheng')
    cy.get('[data-cy=email]').type('kany@test.com')
    cy.get('[data-cy=birthDate]').type('1998-03-22')
    cy.get('[data-cy=city]').type('Paris')
    cy.get('[data-cy=postalCode]').type('75015')

    cy.get('[data-cy=submit]').should('not.be.disabled')
    cy.get('[data-cy=submit]').click()

    cy.get('[data-cy=success]').should('contain', 'Inscription enregistrée')

    cy.get('[data-cy=firstName]').should('have.value', '')
    cy.get('[data-cy=lastName]').should('have.value', '')
    cy.get('[data-cy=email]').should('have.value', '')
  })

  it('inscription avec fixture', () => {
    cy.fixture('example').then((user) => {
      cy.get('[data-cy=firstName]').type(user.firstName)
      cy.get('[data-cy=lastName]').type(user.lastName)
      cy.get('[data-cy=email]').type(user.email)
      cy.get('[data-cy=birthDate]').type(user.birthDate)
      cy.get('[data-cy=city]').type(user.city)
      cy.get('[data-cy=postalCode]').type(user.postalCode)

      cy.get('[data-cy=submit]').click()
      cy.get('[data-cy=success]').should('be.visible')
    })
  })

  it('l\'erreur disparait quand on corrige le champ', () => {
    cy.get('[data-cy=firstName]').type('123').blur()
    cy.get('[data-cy=error-firstName]').should('exist')

    cy.get('[data-cy=firstName]').clear().type('Jean')
    cy.get('[data-cy=error-firstName]').should('not.exist')
  })

  it('le toaster disparait si on modifie un champ apres inscription', () => {
    cy.get('[data-cy=firstName]').type('Kany')
    cy.get('[data-cy=lastName]').type('Chheng')
    cy.get('[data-cy=email]').type('kany@test.com')
    cy.get('[data-cy=birthDate]').type('1998-03-22')
    cy.get('[data-cy=city]').type('Paris')
    cy.get('[data-cy=postalCode]').type('75015')

    cy.get('[data-cy=submit]').click()
    cy.get('[data-cy=success]').should('exist')

    cy.get('[data-cy=firstName]').type('Marie')
    cy.get('[data-cy=success]').should('not.exist')
  })
})
