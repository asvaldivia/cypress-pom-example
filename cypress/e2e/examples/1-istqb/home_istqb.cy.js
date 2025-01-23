Cypress.config('defaultCommandTimeout', 10000);

describe('Home of ISTQB', () => {
    beforeEach(() =>{
        cy.clearCache();
        cy.visit('https://www.istqb.org/');
    })

    it('Should have a tittle', () => {
        cy.title().should('include', 'International Software Testing Qualifications Board');
    })

    it('should find certifications', () => {
        let categoriesTextArray;
        // clicking on certifications
        cy.get('ul.header-nav.header-nav-main.nav.nav-left.nav-line-bottom.nav-size-medium.nav-spacing-xlarge > li:nth-child(2)', {timeout: 10000}).click();
        // we want to know how many certification categories we can see
        cy.get('div[id="content"] > section:nth-child(2) > div > div > a > span')
        .then((categories) => {
            cy.task('logMessage', 'Number of categories found: ',categories.length);
            expect(categories.length).to.be.greaterThan(2);
            categoriesTextArray = [...categories].map(category => category.innerText);
        })

        // counting the courses in each category,
        // should be at least 1 courses available for each category
        categoriesTextArray.forEach(category => {
            // use the cy.get(#id).contains('text') to find the category
            cy.get('div.text h2').each((element) => {
                if(element.text() === category){
                    // find the parent of the category
                    const parent = element.parent();
                    // find the sibling of the parent
                    const sibling = parent.siblings();
                    // find the courses
                    const courses = sibling.find('div.text h3');
                    // log the number of courses
                    cy.task('logMessage', 'Number of courses found for category {{category}}: ', courses.length);
                    expect(courses.length).to.be.greaterThan(1);
                }
            })
        })
    })

    it('should find training providers', () => {
        // Check more than 2 training providers

    })
    
})
Cypress.config('defaultCommandTimeout', 4000);