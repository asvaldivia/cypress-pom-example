import istqbHome from "../../../pages/istqb/IstqbHomePage";
import istqbCertifications from "../../../pages/istqb/IstqbCertificationsPage";
import IstqbTrainingProvidersPage from "../../../pages/istqb/IstqbTrainingProvidersPage";

const _istqbHome = new istqbHome();
const _istqbCertifications = new istqbCertifications();
const _istqbFindTrainers = new IstqbTrainingProvidersPage();

describe('ISTQB Tests', () => {
    beforeEach(() =>{
        cy.clearCookies();
        cy.clearLocalStorage();
        indexedDB.deleteDatabase('keyval-store');
        _istqbHome.visit();
    })

    it('Should have a tittle', () => {
        cy.title().should('eq', _istqbHome.title);
    })

    it('Should find certifications', () => {
        let categoriesTextArray;
        // clicking on certifications
        _istqbHome.clickCertificationsButton();
        // we want to know how many certification categories we can see
        _istqbCertifications.getCertificationCategories()
        .then((categories) => {
            expect(categories.length).to.be.greaterThan(2);
            categoriesTextArray = [...categories].map(category => category.innerText);
            // counting the courses in each category,
            // should be at least 1 courses available for each category
            categoriesTextArray.forEach(category => {
                _istqbCertifications.getCertificationSections().each(($element) => {
                    const elementText = $element.text().trim();
                    if(elementText === category){
                        // find the parent of the category
                        _istqbCertifications.findCertifications($element)
                        .then(($certifications) => {
                            // assert more than 1 certification by category
                            expect($certifications.length).to.be.greaterThan(0);
                        });
                    }
                })
            })
        })
    })

    it('should find training providers', () => {
        // Check more than 2 training providers
        _istqbHome.clickTrainingProvidersButton();
        _istqbFindTrainers.clickSearchForTrainers();
        _istqbFindTrainers.acceptCookiesIfExist();
        _istqbFindTrainers.findTrainers().should('have.length.greaterThan', 2);
    })
    
})
