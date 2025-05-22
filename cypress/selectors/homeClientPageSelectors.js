export const HomeClientPageSelectors = { 
    startBookingRoomBtn: "div:nth-child(4) div.col-sm-7 > button.openBooking",
    firstNameInput: "input[name='firstname']",
    lastNameInput: "input[name='lastname']",
    emailInput: "input[name='email']",
    phoneInput: "input[name='phone']",
    bookRoomBtn: "button.btn-outline-primary.book-room",
    // Selectors for the booking confirmation
    errorAlert: ".alert > p",
    bookedDates: ".rbc-event-content:first-of-type",
    successModal: ".ReactModal__Content",
    successMessage: ".col-sm-6 > h3",
    closeSuccessModal: ".col-sm-12 > .btn",
}