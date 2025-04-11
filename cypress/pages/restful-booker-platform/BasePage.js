class BasePage {
    constructor (path=''){
        this.environment = Cypress.env('ENVIRONMENT') || 'development';

        this.baseUrl = this.getBaseUrl();

        this.path = path;

        this.url = `${this.baseUrl}${this.path}`;

        Cypress.log({   
            name: 'PageObject',
            message: `Initialized ${this.constructor.name} for ${this.environment} environment: ${this.url}`
        });
    }

    getBaseUrl(){
        // You could load this from:
        // 1. Cypress environment variables
        // 2. External configuration file
        // 3. API call to a configuration service
        // 4. Computed based on other factors
      
        const environments = {
            development: 'http://localhost:8080/',
            staging: 'http://localhost:8080/',
            production: 'http://localhost:8080/'
        };
      
        return environments[this.environment];
    }

    // --- Navigation Methods ---
  
    /**
     * Visit this page
     * @param {Object} options - Additional options to pass to cy.visit()
     * @returns {BasePage} - Returns this page object for method chaining
     */
    visit(options = {}) {
        cy.visit(this.url, options);
        return this;
    }
    
    /**
     * Reload the current page
     * @returns {BasePage} - Returns this page object for method chaining
     */
    reload() {
        cy.reload();
        return this;
    }
  
    // --- Common Element Actions ---
  
    /**
     * Click an element identified by the given selector
     * @param {string} selector - The element selector
     * @returns {BasePage} - Returns this page object for method chaining
     */
    click(selector) {
        cy.get(selector).click();
        return this;
    }
  
    /**
     * Type text into an element identified by the given selector
     * @param {string} selector - The element selector
     * @param {string} text - The text to type
     * @param {Object} options - Additional options to pass to .type()
     * @returns {BasePage} - Returns this page object for method chaining
     */
    type(selector, text, options = {}) {
        cy.get(selector).type(text, options);
        return this;
    }
  
    /**
     * Wait for a specific amount of time (use sparingly!)
     * @param {number} milliseconds - Time to wait in milliseconds
     * @returns {BasePage} - Returns this page object for method chaining
     */
    wait(milliseconds) {
        cy.wait(milliseconds);
        return this;
    }
  
    /**
     * Get the document title
     * @returns {Cypress.Chainable} - Returns a Cypress chainable for the title
     */
    getTitle() {
        return cy.title();
    }

    /**
     * Set the system clock to a specific date and time
     * @param {Date} targetDate - The date and time to set the system clock to
     * Does not return anything, works directly on the system clock
    */
    setSystemClock(targetDate) {
        cy.clock(targetDate.getTime());
    }

    /**
     * Select an option from a dropdown
     * @param {string} selector - The dropdown selector
     * @param {string} value - The value to select
     * @returns {BasePage} - Returns this page object for method chaining
    */
    select(selector, value) {
        cy.get(selector).select(value);
        return this;
    }

    /**
     * Return the selector
     * for being used on tests
     * so assertions can be handled on the test files
     * @param {string} selector - The selector to return
     * @returns {cy.get(selector)} - Returns the cypress representation of the element
     * in the DOM
    */
    getSelector(selector) {
        return cy.get(selector);
    }
}

export default BasePage;