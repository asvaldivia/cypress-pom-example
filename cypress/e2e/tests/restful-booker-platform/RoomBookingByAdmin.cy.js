import AdminLoginPage from '../../../pages/restful-booker-platform/HomeAdminPage.js';
import ReportPage from '../../../pages/restful-booker-platform/ReportPage.js';
import NavigationBar from '../../../components/NavigationBar.js';

describe.skip('Room Booking By Admin', () => {
    let adminLoginPage;
    let reportPage;
    let user;
    before(() => {
        // Generate personal data
        cy.generateUserData().then((userData) => {
            user = userData; // Assign the yielded data to the 'user' variable
            cy.log('User data available in before hook:', user);
        });
    });

    beforeEach(() => {
        // Visiting the Login Page for Admin of Restful Booker Platform
        adminLoginPage = new AdminLoginPage();
        reportPage = new ReportPage();

        // Set the system clock to a specific date and time
        reportPage.setSystemClock(new Date(2025, 4, 7, 0, 0, 0));

        // Visit, login, assertion
        adminLoginPage.visit();
        adminLoginPage.login('admin', 'password')
            .assertHomePageLogoutIsVisible();
        
        // Set the intercept for the booking request
        cy.interceptBookingRequest();
    })

    afterEach(() => {
        // Always restore the clock after each test, 
        // if this spec will have multitple tests,
        cy.clock().then((clock) => clock.restore());
        // call api for delete booking (teardown)
        cy.deleteBooking();
    })

    it('should allow an admin to book a room', () => {
        // Navigate to the report page
        NavigationBar.goToRepors();
        reportPage.assertReportPageIsVisible();

        // Select dates for booking
        reportPage.selectDatesForBooking()
            .fillInBookingDetails(user.firstname, user.lastname, '101', 'true')
            .confirmBooking()
            .getErrorAlert().should('not.exist');
        
        // Wait for the booking request to complete and get the bookingid
        cy.waitForBookingRequest();

        // Assert booking confirmation
        reportPage.getBookedDates()
            .should('exist')
            .should('be.visible');
    }); 

    it('Book a room already booked for the dates (Admin)', () => {
        // Make the booking via API
        // the command itself wraps the response to get the bookingid
        // and sets it as an alias
        cy.createBooking();
 
        // Navigate to the report page
        NavigationBar.goToRepors();
        // Select dates for booking, should be the same dates as the previous booking made via API in this test
        reportPage.selectDatesForBooking()
            .fillInBookingDetails(user.firstname, user.lastname, '101', 'true')
            .confirmBooking()
            // Assert booking error
            .getErrorAlert().should('exist');
    })
})