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

// -- Custom commands to handle booking deletion for cleanup --
// This command will intercept the booking request to get the bookingid
// You should call this on the beforeEach hook to start listening for the request
Cypress.Commands.add('interceptBookingRequest', () => {
    cy.intercept('POST', '/booking').as('createBooking');
})

// Wait for the request to be completed
// Call this after the action that creates a booking (cypress functions are asynchronous)
Cypress.Commands.add('waitForBookingRequest', () => {
    cy.wait('@createBooking').then((interception) => {
        expect(interception.response.statusCode).to.equal(201);

        cy.wrap(interception.response.body.bookingid).as('bookingId');
    })
})

// This command will delete the booking
// retrieve the bookingid from the alias on the command above
// to be called on the afterEach hook
// Auth token is not needed because the request is sent on the
// same session and domain (cypress magic)
Cypress.Commands.add('deleteBooking', () => {
    // Verifying if the bookingId alias exists first
    const allAliases = Cypress.state('aliases');
    if (allAliases && allAliases.bookingId) {
      cy.get('@bookingId').then(bookingId => {
        if (bookingId) {
            cy.request({
                method: 'DELETE',
                url: `/booking/${bookingId}`,
                headers: {
                    'content-Type': 'application/json'
                    //'cookie': `token=${authToken}`
                },
                failOnStatusCode: false,
            });
        }
      });
    }
})

// This command will make a booking
Cypress.Commands.add('createBooking', () => {
    cy.request({
        method: 'POST',
        url: '/booking/',
        headers: {
            'content-Type': 'application/json'
        },  
        body: {
            'bookingdates': 
                {
                    'checkin':'2025-04-27',
                    'checkout':'2025-05-03'
                },
            'depositpaid':true,
            'firstname':'Alvaro Salvador',
            'lastname':'Valdivia Calizaya',
            'roomid':1,
            'email':'askas@gmail.com',
            'phone':'59175330974'
        },
        failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('bookingid');

        cy.wrap(response.body.bookingid).as('bookingId');
    });
})


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

// Clearing cache
Cypress.Commands.add('clearCache', { prevSubject: false }, () => {
    localStorage.clear()
    indexedDB.deleteDatabase('cypress')
    return true
  })

