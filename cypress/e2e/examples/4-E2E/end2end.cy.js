describe('End To End tests with focus in the login of an app', () => {
    
    beforeEach(() => {
        cy.task('dbTearDown').then((message) => {
            // Log the message in the browser's console
            cy.window().then((win) => {
              win.console.log('Message from Node task:', message);
            });
        });
        cy.task('dbSeed').then((message) => {
            // Log the message in the browser's console
            cy.window().then((win) => {
              win.console.log('Message from Node task:', message);
            });
        });
    })

    // Verifying that user cannot go to secure site whitout login properly
    it('Veryfing that user needs to AUTH first', () => {
       cy.request({
        url: 'https://the-internet.herokuapp.com/basic_auth',
        failOnStatusCode: false
       }).then((response) => {
        expect(response.status).to.eq(401);
       })
    })
    
    // Login with AUTH
    it('Veryfing a success login with AUTH', () => {
        cy.visit('https://the-internet.herokuapp.com/basic_auth', 
        {
            auth: {
                username: 'admin',
                password: 'admin'
            }
        }
        );
        cy.get('p').should('include.text', 'Congratulations! You must have the proper credentials.');
    })

    // Login with POST Request
    it('Verifying a success login with POST Request', () => {
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
        cy.get('.subheader').should('include.text', 'Welcome to the Secure Area. When you are done click logout below');
    })
    // Login with POST Request from cypress commands
    it('Verifying a success login with POST invoking from cypress command', () => {
        cy.loginPOST();
        cy.get('.subheader').should('include.text', 'Welcome to the Secure Area. When you are done click logout below');
    })
})