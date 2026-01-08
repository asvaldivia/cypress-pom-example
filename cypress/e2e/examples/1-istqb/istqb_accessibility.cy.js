import 'cypress-axe';
import { terminalLog } from '../../../utils/logs.js';

describe('Accessibility test for ISTQB', () => {

    it('Should have no detectable accessibility violations on load home', () => {
        cy.clearCookies();
        cy.clearLocalStorage();
        indexedDB.deleteDatabase('keyval-store');
        cy.visit('https://www.istqb.org');
        cy.injectAxe()
        cy.checkA11y(null, {
            includedImpacts: ['high']
          }, terminalLog);
    })
})
