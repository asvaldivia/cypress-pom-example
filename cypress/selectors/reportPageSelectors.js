export const ReportPageSelectors = {
    todayButton: ".rbc-toolbar > :nth-child(1) > :nth-child(1)",
    todayInTheCalendar: ".rbc-today",
    // Selectors for the booking popup
    firstnameInput: "input[name='firstname']",
    lastnameInput: "input[name='lastname']",
    roomSelector: "#roomid",
    depositPaidSelector: "#depositpaid",
    bookButton: ".btn-outline-primary",
    cancelButton: ".btn-outline-danger",
    // Selectors for the booking confirmation
    errorAlert: ".alert > p",
    bookedDates: ".rbc-event-content:first-of-type",
}