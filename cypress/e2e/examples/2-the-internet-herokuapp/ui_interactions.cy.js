describe('The Internet heroku app - Login', () => {
    beforeEach(() => {
        cy.visit('https://the-internet.herokuapp.com');
    })

    it('should verify content in new window', () => {
        cy.contains('Multiple Windows').click();
        // invoke makes that functions, jquery functions can be
        // called to be executed
        // we are removing the attribute target to avoid opening a new tab
        cy.contains('Click Here').invoke('removeAttr', 'target').click();
        cy.contains('New Window').should('have.text', 'New Window');
    })

    it('should verify the first and last web element', () => {
        cy.contains('Dynamic Content').click();
        cy.get('img').first().should('be.visible');
        cy.get('img').last().should('be.visible');
    })

    it('should get the father and children element from a selected element', () => {
        cy.contains('Dynamic Content').click();
        cy.get(':nth-child(1) > .large-10').parent();
        cy.get('#content > :nth-child(4)').children();
        
    })

    it('should check and uncheck a checkbox element', () => {
        cy.contains('Checkboxes').click();
        // always use check and uncheck functions when working with checkboxes
        // you can use click too, but using click you cannot control the final
        // state of a checkbox element
        cy.get('#checkboxes > :nth-child(1)').check();
        cy.get('#checkboxes > :nth-child(3)').uncheck();
    })

    it('should select an option from a dropdown', () => {
        cy.contains('Dropdown').click();
        // selecting an option by text
        cy.get('#dropdown').select('Option 1');
        // selecting an option by index
        //cy.get('#dropdown').select(0);
    })

    it('should click in a non-visible element, like a hover previous to click in the element (using force)', () => {
        cy.contains('Hovers').click();
        cy.get('#content > div > div:nth-child(4) > div > a').click({force: true});
    })

    it('should right click handling a context menu', () => {
        cy.contains('Context Menu').click();
        cy.get('#hot-spot').rightclick();
        cy.on('window:alert', (alert) => {
            expect(alert, 'asserting correct alert text').to.equal('You selected a context menu');
        });
    })

    it.skip('should assert an element in a dynamic table using each', () => {
        // REASON FOR SKIP: /dynamic-table resource not found
        // Adding origin to navigate to another domain, necessary because
        // we visit another domain first
        cy.origin('https://chercher.tech/', () => {
            // Get the exception to make cypress ignore, it is necessary to add here
            // because when cy.origin command is used, the new origin does not get
            // support/e2e.js configurations to execute the code
            // and the new domain/page shows uncaught execptions that make cypress fail
            Cypress.on('uncaught:exception', () => false);
            // Visiting the page
            cy.visit('https://chercher.tech/practice/dynamic-table');
            // Getting the column number 2 from a table and iterating the elements
            cy.get('#table > tbody > tr > td:nth-child(2)').each(($elem, index, $list) => {
                // Getting the text from the element
                const text = $elem.text();
                // Checking if facebook.com is included in the text got
                if(text.includes('facebook.com')) {
                    // Getting the table column number 2 again, but also getting the index element and
                    // selecting the next element in the table
                    cy.get('#table > tbody > tr > td:nth-child(2)').eq(index).next().then(p => {
                        // Extracting the text of the next element
                        const text_to_verify = p.text();
                        // Asserting that the text should contain Social Media
                        expect(text_to_verify, 'should be Social Media').to.contains('Social Media');
                    })
                }
            })
        })
    })

    it.skip('should check an element in a dynamic table using contains', () => {
        // REASON FOR SKIP: /dynamic-table resource not found
        // Adding origin to navigate to another domain, necessary because
        // we visit another domain first
        cy.origin('https://chercher.tech', () => {
            // Get the exception to make cypress ignore, it is necessary to add here
            // because when cy.origin command is used, the new origin does not get
            // support/e2e.js configurations to execute the code
            // and the new domain/page shows uncaught execptions that make cypress fail
            Cypress.on('uncaught:exception', () => false);
            // Visiting the page
            cy.visit('https://chercher.tech/practice/dynamic-table');
            // Getting the tds, and selecting the element that contains the facebook.com text
            cy.contains('td', 'facebook.com')
            // navigating to the after element form the selected
            .prev()
            // getting the element input from the element selected
            // necessary to interact with the check() function
            .find('input')
            .check()
            .should('be.checked');
        })
    })
})