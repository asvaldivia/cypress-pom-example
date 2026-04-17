import HomeClientPage from '../../../pages/restful-booker-platform/HomeClientPage.js';
import BasePage from '../../../pages/restful-booker-platform/BasePage.js';

// To run this suite, make sure to have the Restful Booker Platform running locally and the database is reset to the initial state, then execute the following command in the terminal:
// npx cypress run --spec "cypress/e2e/tests/restful-booker-platform/RoomBookingByAdmin.cy.js"
// This suite will be skipped by default for ci cd pipeline runs success, to enable it, remove the .skip from the describe block and run the command above.
// You could refer to the forked restful booker platform repository for more details about the setup of the application and database reset, also you will 
// find the API commands used in this test suite for setup and teardown processes, as weel as a circle ci pipeline to run this suite on
// and ephemeral environment setup for the application, database and cypress execution.

// TODO: circle ci pipeline injects flag to run this suite OR check health before running the tests
// If the flag is not injected this suite will be skipped.
describe('Room Booking By Client', () => {
    let homeClientPage;
    let user;
    before(function() {
        let basePage = new BasePage();
        const url = basePage.baseUrl;         // already resolved in the constructor
        cy.isBookingPlatformHealthy(url).then(function(isHealthy) {
            if (!isHealthy) {
                this.skip(); // Skip the entire suite if the platform is not healthy
            }
        });
        cy.generateUserData().then((userData) => {
            user = userData; // Assign the yielded data to the 'user' variable
            cy.log('User data available in before hook:', user);
        })
    })

    beforeEach(() => {
        // Visiting the Login Page for Client of Restful Booker Platform
        homeClientPage = new HomeClientPage();
        homeClientPage.visit();

        // Login by API, necessary because token data is mandatory for delete the booking
        // as part of the teardown process
        homeClientPage.loginByApi();

        // Set the system clock to a specific date and time
        homeClientPage.setSystemClock(new Date(2025, 4, 7, 0, 0, 0));

        // Set the intercept for the booking request
        cy.interceptBookingRequest();

    })

    afterEach(() => {
        // Always restore the clock after each test, 
        // if this spec will have multitple tests,
        cy.clock().then((clock) => clock.restore());

        // call api for delete booking (teardown)
        cy.deleteBooking();

    });

    it('should allow a client to book a room', () => {
        const checkinDate = '2025-05-07';
        const checkoutDate = '2025-05-09';

        homeClientPage.selectDatesForBooking(checkinDate, checkoutDate);

        // Select dates for booking
        homeClientPage.startBookingRoom()
            .bookingRoom(user.firstname, user.lastname, user.email, '123123123123');

        // Assert booking confirmation
        cy.wait('@bookingRequestToInjectData').its('response.body.booking.bookingdates').should('deep.equal', {
            checkin: checkinDate,
            checkout: checkoutDate
        });
        cy.waitForBookingRequest(); 

        // Assert success modal
        homeClientPage.getSuccessModal().should('exist');

        // Assert booked dates
        homeClientPage.getBookedDates().should('exist')
            .and('be.visible')
            .and('contain', 'Unavailable');
    }); 

    it('Book a room already booked for the dates (Client)', () => {
        const checkinDate = '2025-04-27';
        const checkoutDate = '2025-05-03';
        // Make the booking via API
        // the command itself wraps the response to get the bookingid
        // and sets it as an alias
        cy.createBooking();

        // Select dates for booking, should be the same dates as the previous booking made via API in this test
        homeClientPage.selectDatesForBooking(checkinDate, checkoutDate);

        homeClientPage.startBookingRoom()
        .bookingRoom(user.firstname, user.lastname, user.email, '67576556789')
        // Assert booking error
        .getErrorAlert()
            .should('exist').
            and('contain', 'The room dates are either invalid or are already booked for one or more of the dates that you have selected.');
    })
});
