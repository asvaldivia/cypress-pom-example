class IstqbTrainingProvidersPage {
    
    constructor() {
        this.url = 'https://www.istqb.org/training-providers/';
        this.title = 'Training Providers - International Software Testing Qualifications Board';
    }

    elements = {
        searchTrainersButton: () => cy.get('#desktop-dropdowns > div.w-full.flex.items-center.mb-6 > button:nth-child(1)'),
        trainersTable: () => cy.get('div#desktop-results', {timeout: 20000})
    }

    visit() {
        cy.visit(this.url);
    }

    clickSearchForTrainers(){
        this.elements.searchTrainersButton().click();
    }

    findTrainers(){
        return this.elements.trainersTable().then(($providers) => {
            cy.wrap($providers)
            .find('tr')
        })
    }

    acceptCookiesIfExist(){
        try{
            cy.get('.primary > span').then(($button) => {
                if($button.length > 0){
                    cy.wrap($button).click();
                }
            })
        } catch(error) {
            cy.task('logMessage', 'No cookies found');
        }
            
    }
}

export default IstqbTrainingProvidersPage;