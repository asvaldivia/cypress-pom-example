import BasePage from "./BasePage";
import { ReportPageSelectors } from "../../selectors/reportPageSelectors.js";

class ReportPage extends BasePage {
    constructor () {
        super('/#/admin/report');
        this.elements = ReportPageSelectors;
    }

    assertReportPageIsVisible() {
        cy.location('pathname').should('eq', '/');
        cy.location('hash').should('eq', '#/admin/report');
    }

    selectDatesForBooking() {

        // Define selectors
        const startCellSelector = 'div.rbc-day-bg.rbc-today';
        const rowSelector = '.rbc-row-bg';
        const targetCellIndex = 5;
        const popupSelector = 'button.btn.btn-outline-primary.float-right.book-room'; // Selector for the popup

        // Get the starting cell
        cy.get(startCellSelector).then(($startCell) => {

            // Get start cell position
            const startRect = $startCell[0].getBoundingClientRect();
            const startX = startRect.left + startRect.width / 2;
            const startY = startRect.top + startRect.height / 2;

            // Perform the real mouse down event on the starting cell
            cy.wrap($startCell).realMouseDown({ position: 'topLeft' });

            // Get the parent row and find the target cell
            cy.get(startCellSelector)
            .parent(rowSelector)
            .children()
            .eq(targetCellIndex)
            .then(($endCell) => {
                // Get end cell position
                const endRect = $endCell[0].getBoundingClientRect();
                const endX = endRect.left + endRect.width / 2;
                const endY = endRect.top + endRect.height / 2;

                // Simulate mousemove events
                const steps = 10;
                for (let i = 1; i <= steps; i++) {
                    const currentX = startX + (i / steps) * (endX - startX);
                    const currentY = startY + (i / steps) * (endY - startY);
                    cy.get('body').realMouseMove(currentX, currentY);
                }

                // Restore the clock to the original time
                // before to finish the action
                // this will prevent the clock from being set to the future time
                // and because an issue experienced with the react-big-calendar component
                cy.clock().then((clock) => clock.restore());

                // Perform the real mouse up event on the target cell
                cy.wrap($endCell).realMouseUp({ position: 'topLeft', force: true });

                // Wait for the popup to appear and assert its presence
                cy.get(popupSelector, { timeout: 10000 }).should('be.visible');
            });
        });
    
        return this;
    }

    fillInBookingDetails(firstName, lastName, room, paid) {
        // Fill in the booking details
        this.type(this.elements.firstnameInput, firstName);
        this.type(this.elements.lastnameInput, lastName);
        this.select(this.elements.roomSelector, room);
        this.select(this.elements.depositPaidSelector, paid);
        return this;
    }

    confirmBooking() {
        this.click(this.elements.bookButton);
        return this;
    }

    getErrorAlert() {
        return this.getSelector(this.elements.errorAlert);
    }

    getBookedDates() {
        return this.getSelector(this.elements.bookedDates);
    }
}

export default ReportPage;