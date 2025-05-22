describe('API Testing using cypress and request', () => {

    it('Validating status code 200 OK', () => {
        cy.request({
            url: 'https://jsonplaceholder.typicode.com/posts'
        }).then((response) => {
            expect(response.status).to.eq(200);
        });

    })

    it('Validating quantity of elements retrieved by GET, it should be 100', () => {
        cy.request({
            url: 'https://jsonplaceholder.typicode.com/posts'
        })
        .its('body')
        .should('have.lengthOf', 100);
    })

    // Validate that it is possible to retrieve an element using pagination and verify that at least has the property
    // title and has value or is not null or empty

    it('Validating that the response has the property title, is not null, and have an string', () => {
        cy.request({
            url: 'https://jsonplaceholder.typicode.com/posts/1'
        })
        .its('body')
        .should('have.property', 'title')
        .and('not.null')
        .and('be.a', 'string');
    })

    it('Validating a POST request', () => {
        cy.request('POST', 'https://jsonplaceholder.typicode.com/posts', {
            title: 'A title.',
            body: 'A test body, ok.',
            userId: 1
        }).then((response) =>  {
            expect(response.status).to.be.eq(201);
            expect(response.body).to.have.property('title', 'A title.');
        })
    })

    it('Validating that a resourse is updated correctly with PUT', () => {
        cy.request('PUT', 'https://jsonplaceholder.typicode.com/posts/1', {
            title: 'Edited title, a different title.'
        }).then((response) => {
            expect(response.status).to.be.eq(200);
            expect(response.body).to.have.property('title', 'Edited title, a different title.');
        })
    })

    it('Validating that a resourse can be deleted with DELETE', () => {
        cy.request('DELETE', 'https://jsonplaceholder.typicode.com/posts/1')
        .then((response) => {
            expect(response.status).to.be.eq(200);
            expect(response.body).to.be.empty;
        })
    })

    it('Stubbing a request response', () => {
        const fixed_response = [
            {
              "userId": 1,
              "id": 1,
              "title": "Mocked response 1",
              "completed": false
            },
            {
              "userId": 1,
              "id": 2,
              "title": "Second mocked response",
              "completed": false
            }
        ]

        cy.intercept('GET', '/todos', fixed_response).as('staticResponse');

        // Stubbing a request response with a 204 status code, that resource takes too much time to
        // respond and blocked the page load event
        cy.intercept('GET', '**/ethicalads.min.js', {
            statusCode: 204, // No content
            body: '',
          }).as('blockedJS');

        cy.visit('https://jsonplaceholder.typicode.com', 
            {
                timeout: 10000,
                failOnStatusCode: false
            });
        
        cy.get(':nth-child(5) > :nth-child(1) > a').click();

        cy.wait('@staticResponse').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body[0].title).to.include('Mocked response 1');
            expect(interception.response.body[1].title).to.include('Second mocked response');
        });


    })
})