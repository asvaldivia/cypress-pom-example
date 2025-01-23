describe('The Internet heroku app - Login', () => {
    beforeEach(() => {
        cy.visit('https://the-internet.herokuapp.com/login');
        cy.url().should('contain', '/login');
    })

    // without using ddt and commands
    // showing logs capabilities with cypress
    it('should login successfully', () => {
        // creating an alias for user and password
        cy.get('#username').as('username');
        cy.get('#password').as('password');

        cy.log('Type the tomsmith username');
        cy.get('@username').clear().type('tomsmith');
        cy.log('Type the password');
        cy.get('@password').clear().type('SuperSecretPassword!');
        cy.get('.radius').click();    
        cy.url().should('contain', '/secure');
        cy.get('.button').should('exist')
        .and('be.visible');
        // loging using 'task' configured in cypress.config.js
        cy.task('logMessage', 'Login finished, sent by a cy.task');
    })

})