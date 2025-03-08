class IstqbCertificationsPage {

    constructor () {
        this.url = 'https://www.istqb.org/certifications/';
        this.title = 'Certifications - International Software Testing Qualifications Board';
    }

    elements = {
        certificationCategories: () => cy.get('div[id="content"] > section:nth-child(2) > div > div > a > span'),
        certificationSections: () => cy.get('div.text h2'),
        certifications: () => cy.get('div.text h3'),
    }

    getCertificationCategories() {
        return this.elements.certificationCategories();
    }

    getCertificationSections() {
        return this.elements.certificationSections();
    }

    getCertifications() {
        return this.elements.certifications();
    }

    findCertifications(element) {
        return cy.wrap(element)
                .parentsUntil('div.section-content.relative')
                .find('div.text h3');
    }
    
}
export default IstqbCertificationsPage;