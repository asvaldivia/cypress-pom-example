// This is a class that will abstrac
// t the page object model for free range testers home page
class freerangeHome {
    visitFreeRangeHome(){
        cy.visit('https://www.freerangetesters.com');
    }

    // Locators
    getTitle(){
        return cy.title();
    }
    getCoursesButton(){
        return cy.get('[data-testid="header-container"]').contains('Cursos');
    }

    getUdemyCoursesSection(){
        return cy.contains('Udemy');
    }

    getCourses(){
        return cy.get('[data-testid=container].sc-dDvxFM.dHVGEg')
        .eq(2)
        .find('h3')
    }

    getNavigationBar(){
        return cy.get("#page_header > div > section > div > header > nav > ul > li");
    }

    // Actions
    clickOnCourses(){
        this.getCoursesButton().click();
    }
}
export default freerangeHome;