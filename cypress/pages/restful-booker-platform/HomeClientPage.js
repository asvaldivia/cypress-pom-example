import { HomeClientPageSelectors } from '../../selectors/homeClientPageSelectors.js';
import BasePage from './BasePage';

class HomeClientPage extends BasePage {
    constructor() {
        super('');
        this.elements = HomeClientPageSelectors;
        
    }

    loginByApi() {
        cy.request('POST', this.url + 'auth/login',
        {
            username: 'admin',
            password: 'password'
        })
    }

    startBookingRoom() {
        return this.click(this.elements.startBookingRoomBtn);
    }

    selectDatesForBooking(checkin, checkout) {
        cy.intercept('POST', '/booking', (req) => {
            if(req.body && req.body.bookingdates) {
                req.body.bookingdates.checkin = checkin;
                req.body.bookingdates.checkout = checkout;
            }
        }).as('bookingRequestToInjectData');
    }

    bookingRoom(firstName, lastName, email, phone) {
        // Fill in the booking details
        this.type(this.elements.firstNameInput, firstName);
        this.type(this.elements.lastNameInput, lastName);
        this.type(this.elements.emailInput, email);
        this.type(this.elements.phoneInput, phone);
        this.click(this.elements.bookRoomBtn);
        return this;
    }

    getErrorAlert() {
        return this.getSelector(this.elements.errorAlert);
    }

    getSuccessModal() {
        return this.getSelector(this.elements.successModal);
    }

    getBookedDates() {
        this.click(this.elements.closeSuccessModal);
        this.click(this.elements.startBookingRoomBtn);
        return this.getSelector(this.elements.bookedDates);
    }

}

export default HomeClientPage;