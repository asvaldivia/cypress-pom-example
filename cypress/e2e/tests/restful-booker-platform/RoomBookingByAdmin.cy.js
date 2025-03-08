import AdminLoginPage from '../../../pages/restful-booker-platform/HomeAdminPage.js';

describe('Room Booking By Admin', () => {
    let adminLoginPage;
    beforeEach(() => {
        // Visiting the Login Page for Admin of Restful Booker Platform
        adminLoginPage = new AdminLoginPage();
        adminLoginPage.visit();
    })

    it('should allow an admin to book a room', () => {
        adminLoginPage.login('admin', 'password');
    })
})