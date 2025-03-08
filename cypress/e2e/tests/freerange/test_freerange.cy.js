import freerangeHome from "../../../page/freerange/FreeRangeHomePage";
const freerange_home = new freerangeHome();

describe('Home of freerange', () => {
    beforeEach(() =>{
        freerange_home.visitFreeRangeHome();
    })

    it('Should have a tittle', () => {
        freerange_home.getTitle().should('include', 'Free Range Testers');
    })

    it('should find courses', () => {
        // clicking on courses
        freerange_home.clickOnCourses();
        // we want to know how many courses we can see
        // lets suppose we want to see always more than 3 courses
        freerange_home.getCourses().should('have.length.above', 3);
    })

    it('should find and verify options on navigation bar', () => {
        freerange_home.getNavigationBar()
        .should('have.length.greaterThan', 3)
        .and('include.text', 'Cursos')
        .and('include.text', 'Blog')
        .and('include.text', 'Mentorías')

    })

})