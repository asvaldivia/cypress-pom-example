describe('Examples of the use of fixtures capabilities from cypress', () => {

    before(function(){
        cy.visit('https://the-internet.herokuapp.com/login')
        cy.fixture('heroku_login_credentials').then(function(testData){
            this.testData = testData
        })
    })

    it('Validating successful login', function(){
        cy.get('#username').type(this.testData.username)
        cy.get('#password').type(this.testData.password)
        cy.get('button[type="submit"]').click()
        cy.url().should('contain', '/secure')
    })
})