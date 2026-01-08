class istqbHome {

    constructor () {
        this.url = 'https://www.istqb.org/';
        this.title = 'International Software Testing Qualifications Board (ISTQB)';
    }

    elements = {
        certificationsButton: () => cy.get('ul.header-nav.header-nav-main.nav.nav-left.nav-line-bottom.nav-size-medium.nav-spacing-xlarge > li:nth-child(2)', {timeout: 10000}),
        trainingProvidersButton: () => cy.get('#menu-item-35 > a', {timeout: 10000}),
        findTrainingButton: () => cy.get('div.text p > a[href="/training-providers?directory_type=training-providers"]', {timeout: 10000}),
    }

    visit() {
        cy.visit(this.url);
    }

    clickCertificationsButton() {
        this.elements.certificationsButton().click();
    }

    clickTrainingProvidersButton() {
        this.elements.trainingProvidersButton().click();
        this.elements.findTrainingButton().click();
    }

}

export default istqbHome;