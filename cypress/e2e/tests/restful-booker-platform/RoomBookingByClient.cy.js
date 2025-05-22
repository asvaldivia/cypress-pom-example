import HomeClientPage from '../../../pages/restful-booker-platform/HomeClientPage.js';

describe('Room Booking By Client', () => {
    let homeClientPage;

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
            .bookingRoom('Alvaro', 'Valdivia', 'emailofalvaro@gmail.com', '123123123123');

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
        .bookingRoom('Alvaro', 'Valdivia', 'asdasd@gmail.com', '67576556789')
        // Assert booking error
        .getErrorAlert()
            .should('exist').
            and('contain', 'The room dates are either invalid or are already booked for one or more of the dates that you have selected.');
    })
});
