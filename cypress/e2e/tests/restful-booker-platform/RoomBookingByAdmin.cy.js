import AdminLoginPage from '../../../pages/restful-booker-platform/HomeAdminPage.js';
import ReportPage from '../../../pages/restful-booker-platform/ReportPage.js';
import NavigationBar from '../../../components/NavigationBar.js';
import BasePage from '../../../pages/restful-booker-platform/BasePage.js';


// To run this suite, make sure to have the Restful Booker Platform running locally and the database is reset to the initial state, then execute the following command in the terminal:
// npx cypress run --spec "cypress/e2e/tests/restful-booker-platform/RoomBookingByAdmin.cy.js"
// You could refer to the forked restful booker platform repository for more details about the setup of the application and database reset, also you will 
// find the API commands used in this test suite for setup and teardown processes, as weel as a circle ci pipeline to run this suite on
// and ephemeral environment setup for the application, database and cypress execution.

// TODO: circle ci pipeline injects flag to run this suite.
// If the flag is not injected this suite will be skipped.
// Resolved: a pre check before to execuite the tests has been implemented to check the health of the app.

describe('Room Booking By Admin', () => {
    let adminLoginPage;
    let reportPage;
    let user;
    before(() => {
        let basePage = new BasePage();
        const url = basePage.baseUrl;         // already resolved in the constructor
        cy.isBookingPlatformHealthy(url).then(function(isHealthy) {
            if (!isHealthy) {
                this.skip(); // Skip the entire suite if the platform is not healthy
            }
        });
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