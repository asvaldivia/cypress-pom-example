const testData = require('../../../fixtures/titles.json')

testData.forEach((element) => {
    describe('Validations of the title.', () => {

        it('Verify that for the page: '+ element.location + ' its title is ' + element.title, () => {
            cy.visit(element.location)
            cy.title({timeout: 15000}).should('include', element.title)
        })
    })
})