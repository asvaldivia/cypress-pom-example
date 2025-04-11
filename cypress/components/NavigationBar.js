
class NavigationBar {
    constructor() {
        this.elements = {
            roomsLink: '.order-1.navbar-nav > :nth-child(1) > .nav-link',
            reportLink: '#reportLink',
            brandingLink: '#brandingLink',
            homeLink: '.navbar-brand',
            messagesLink: '.fa.fa-inbox',
            frontLink: '#frontPageLink',
            logoutLink: "a[href='#/admin']"
        }
    }

    goToRooms() {
        cy.get(this.elements.roomsLink).click();
        return this;
    }

    goToRepors() {
        cy.get(this.elements.reportLink).click();
        return this;
    }

    goToBranding() {
        cy.get(this.elements.brandingLink).click();
        return this;
    }

    goToHome() {
        cy.get(this.elements.homeLink).click();
        return this;
    }

    goToMessages() {
        cy.get(this.elements.messagesLink).click();
        return this;
    }

    goToFront() {
        cy.get(this.elements.frontLink).click();
        return this;
    }

    logout() {
        cy.get(this.elements.logoutLink).click();
        return this;
    }
}
export default new NavigationBar();
