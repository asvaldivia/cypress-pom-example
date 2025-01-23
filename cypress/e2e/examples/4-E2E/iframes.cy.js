describe('Handling iframes using commands', () => {

    it('Verify an element exist onto an iframe', () => {
        cy.visit('https://webdriveruniversity.com/IFrame/index.html')
        cy.get('#frame')
        .iframe("button[id='button-find-out-more'] b")
        .should('include.text', 'Find Out More!')
    })
})