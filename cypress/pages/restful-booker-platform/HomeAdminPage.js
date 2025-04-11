import { AdminLoginPageSelectors } from "../../selectors/adminLoginPageSelectors.js";
import BasePage from "./BasePage.js";
import HomePage from "./HomePage.js";

class HomeAdminPage extends BasePage {
    constructor() {
        super('#/admin');

        this.elements = AdminLoginPageSelectors;
    }   

    login(username, password) {
        this.type(this.elements.userNameInput, username);
        this.type(this.elements.passwordInput, password);
        this.click(this.elements.loginButton);

        return new HomePage();
    }
}

export default HomeAdminPage;

