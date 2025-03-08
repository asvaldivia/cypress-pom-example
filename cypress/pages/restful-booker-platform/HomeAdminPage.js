import { AdminLoginPageSelectors } from "../../selectors/adminLoginPageSelectors.js";
import BasePage from "./BasePage.js";

class HomeAdminPage extends BasePage {
    constructor() {
        super('#/admin');

        this.elements = AdminLoginPageSelectors;
    }   

    login(username, password) {
        cy.get(this.elements.userNameInput).type(username);
        cy.get(this.elements.passwordInput).type(password);
        cy.get(this.elements.loginButton).click();
    }
}

export default HomeAdminPage;

