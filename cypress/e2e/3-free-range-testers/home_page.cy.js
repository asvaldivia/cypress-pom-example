describe('Home de freerangetesters.com', () => {
    beforeEach(() =>{
        cy.visit('https://www.freerangetesters.com');
    })

    it('Should have a tittle', () => {
        cy.title().should('include', 'Free Range Testers');
    })

    it('should find courses', () => {
        // clicking on courses
        cy.get('[data-testid="header-container"]').contains('Cursos').click();
        // we want to know how many courses we can see
        // lets suppose we want to see always more than 3 courses
        // courses are sepparated into categories, we need to find more than 1 category
        cy.get('[data-react-component="creator_ui/section_adapters/Categories"] > .sc-egkSDF > [data-testid="container"] > [data-testid="grid"]')
        .find('[data-testid="grid-item"]  li').should('have.length.above', 1);

        cy.get('[data-react-component="creator_ui/section_adapters/Categories"] > .sc-egkSDF > [data-testid="container"] > [data-testid="grid"] > :nth-child(2) > .sc-fufdwm > .sc-Rjrgp > .sc-giBObj > .sc-hJRrWL > .sc-dpBQxM > .sc-diYFot > .sc-cHqXqK > .sc-cEzcPc')
        // counting the the courses in each category,
        // should be more than 5 courses available
        let number_of_courses = 0;

        cy.xpath('(//div[@data-testid="grid"])//h2[text()="Categorías"]//ancestor::div[@data-testid="grid-header"]//following-sibling::div[@data-testid="grid-item"]')
        .each(($element) => {
            let string_blank_space_index= $element.text().indexOf(' ');
            let courses = parseInt($element.text().substring(0, string_blank_space_index), 10);
            if (courses > 0){
                // means that there are courses
                number_of_courses = number_of_courses + courses;
            }
        }).then(() => {
            expect(number_of_courses,'should have more than 5 courses available').to.be.greaterThan(5);
        });
        
    })

    it('should find udemy courses section', () => {
        cy.contains('Udemy');
        // locating using filter, enabled
        cy.get("#page_header > div > section > div > header > nav > ul > li:contains('Udemy')");
        // asserting that there is not an option which button is disabled
        // in this case selecting the even elements
        cy.get("#page_header > div > section > div > header > nav > ul > li")
        .should('have.length.greaterThan', 3)
        .and('include.text', 'Cursos')
        .and('include.text', 'Blog')
        .and('include.text', 'Mentorías');

    })

})