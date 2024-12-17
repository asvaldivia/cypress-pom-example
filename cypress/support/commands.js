// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// global var to use cookie in all specs
Cypress.env('sessionCookie', '');

// login with session
Cypress.Commands.add('login', (username, password) => {
    cy.session([username, password], () => {
        cy.visit('https://the-internet.herokuapp.com/login');
        cy.get('#username').clear().type(username);
        cy.get('#password').clear().type(password);
        cy.get('#login > button').click();
        cy.url().should('contain', '/secure');
        cy.get('.button').should('be.visible');

        // Get the session cookie
        cy.getCookie('rack.session').then(($cookie) => {
        // Store the session cookie value for later use
        Cypress.env('sessionCookie', $cookie.value);
  
        // Now you can use sessionCookie in your tests or other commands
        // For example, you can set it as a cookie in subsequent requests
        // or use it in assertions.
        cy.log('This is the cookie retrieved from commands: ', Cypress.env('sessionCookie'));
        })
    })
})

// handle iFrames
Cypress.Commands.add('iframe', {prevSubject: 'element'}, ($iframe, selector) => {
    Cypress.log({
        name: 'iframe',
        consoleProps(){
            return {
                iframe: $iframe
            }
        }
    })
    return cy.wrap($iframe)
        .its('0.contentDocument.body')
        .should('be.visible')
        .then(($body) => {
            return cy.wrap($body).find(selector)
        })
})

Cypress.Commands.add('loginPOST', () => {
    cy.visit('https://the-internet.herokuapp.com');
        cy.request({
            url: 'authenticate',
            method: 'POST',
            form: true,
            body: {
                username: 'tomsmith',
                password: 'SuperSecretPassword!'
            }
        })
        cy.getCookie('rack.session').should('exist');
        cy.visit('https://the-internet.herokuapp.com/secure');
})

// Example on how can I handle or
// prevent new tabs to be opened so 
// we can ensure a more consistent navigation behavior
// basically intercepting the window before load event to
// modify the implementation of the window's behavior (visiting the same url again)
Cypress.Commands.add('visitInSameTab', (url) => {
    cy.on('window:before:load', (win) => {
        cy.stub(win, 'open').as('windowOpen').callsFake(() => {
            cy.visit(url)
        })
    })
})
