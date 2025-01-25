Cypress.config('defaultCommandTimeout', 10000);

describe('Home of ISTQB', () => {
    beforeEach(() =>{
        cy.clearCache();
        cy.visit('https://www.istqb.org/');
    })

    it.skip('Should have a tittle', () => {
        cy.title().should('include', 'International Software Testing Qualifications Board');
    })

    it.skip('should find certifications', () => {
        let categoriesTextArray;
        // clicking on certifications
        cy.get('ul.header-nav.header-nav-main.nav.nav-left.nav-line-bottom.nav-size-medium.nav-spacing-xlarge > li:nth-child(2)', {timeout: 10000}).click();
        // we want to know how many certification categories we can see
        cy.get('div[id="content"] > section:nth-child(2) > div > div > a > span')
        .then((categories) => {
            cy.task('logMessage', 'Number of categories found: '+ categories.length);
            expect(categories.length).to.be.greaterThan(2);
            categoriesTextArray = [...categories].map(category => category.innerText);
            cy.task('logMessage', 'Catories array: '+ categoriesTextArray);
            // counting the courses in each category,
            // should be at least 1 courses available for each category
            categoriesTextArray.forEach(category => {
                // use the cy.get(#id).contains('text') to find the category
                cy.get('div.text h2').each(($element) => {
                    const elementText = $element.text().trim();
                    cy.task('logMessage', 'This is the element text: '+ elementText);
                    cy.task('logMessage', 'This is the category: '+ category);
                    
                    if(elementText === category){
                        // find the parent of the category
                        cy.wrap($element)
                        .parentsUntil('div.section-content.relative')
                        .find('div.text h3')
                        .then(($certifications) => {
                            // assert more than 1 certification by category
                            expect($certifications.length).to.be.greaterThan(0);
                        });
                    }
                })
            })
        })
    })

    function acceptCookiesIfExist(){
        try{
            cy.get('.primary > span').then(($button) => {
                if($button.length > 0){
                    cy.wrap($button).click();
                }
            })
        } catch(error) {
            cy.task('logMessage', 'No cookies found');
        }
            
    }

    it('should find training providers', () => {
        // Check more than 2 training providers
        cy.get('#menu-item-35 > a', {timeout: 10000}).click();
        cy.get('div.text p > a[href="/training-providers?directory_type=training-providers"]').click();
        cy.get('#desktop-dropdowns > div.w-full.flex.items-center.mb-6 > button:nth-child(1)').click();
        acceptCookiesIfExist();
        cy.get('div#desktop-results', {timeout: 20000}).then(($providers) => {
            cy.wrap($providers)
            .find('tr')
            .should('have.length.greaterThan', 2);
        });

    })
    
})
Cypress.config('defaultCommandTimeout', 4000);
