import { HomeAdminPageSelectors } from "../../selectors/homeAdminPageSelectors.js";
import BasePage from "./BasePage.js";
import NavigationBar from "../../components/NavigationBar.js";

class HomePage extends BasePage{
    constructor() {
        super('/#/admin');
        this.elements = HomeAdminPageSelectors;
        this.navbar = NavigationBar;
    };

    assertHomePageLogoutIsVisible(){
        cy.getCookies().should('have.length', 1);
        cy.getCookies().then((cookies) => {
            Cypress.log({
                name: 'Session cookie',
                message: `Session cookie set ${cookies[0].name} with value ${cookies[0].value}`
            });
            expect(cookies[0].name).to.eq('token');
        });
        cy.get(this.navbar.elements.logoutLink).should('be.visible');
    };
};   
export default HomePage;