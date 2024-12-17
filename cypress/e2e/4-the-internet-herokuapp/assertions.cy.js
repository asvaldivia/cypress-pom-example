describe('The Internet heroku app - Assertions', () => {
    beforeEach(() => {
        cy.visit('https://the-internet.herokuapp.com');
    })

    it('validating with expect', () => {
        expect('asdasd').to.equal('asdasd');
    })

    it('this is a promise', () => {
        let waited = false;

        // function that return a promise (solved in 5 seconds)
        function waitInSeconds(seconds) {
            // promise 
            return new Cypress.Promise((resolve, reject) => {

                setTimeout(() => {
                    // changing waited to true
                    waited = true;
                    //solving with foo
                    resolve('foo');
                }, seconds)
            })
        }

        cy.wrap(null).then(() => {
            // return the promise to cy.then which
            // is waited for a resolution
            return waitInSeconds(3000).then((str) => {
                expect(str).to.equal('foo');
                expect(waited).to.be.true;
            })
        })
    })

    it('example of promise fetching data from an API', () => {

        function fetchData() {
            return new Cypress.Promise((resolve, reject) => {
                // simulating an API call
                setTimeout(() => {
                    const success = true;

                    if(success) {
                        const data = { name: 'Alvaro', age: 27};
                        resolve(data);
                    }
                    else {
                        reject(new error('Failed to fetch data'));
                    }
                }, 2000);
            });
        }
        //using the promise to fetch the data
        cy.wrap(null).then(() => {
            return fetchData()
            .then((data) => {
                cy.log('Data', data);
                //expect(data).to.deep.include({ name: 'Juan' });
                //let data_string = string(data);
                //cy.log('data stringed: ', data_string);
                cy.wrap(data).should('deep.include', { name: 'Alvaro' });
            })
            .catch((error) => {
                cy.log('Error ', error);
            })
        })

    
        
    })

    it('example of chaining promises', () => {
        function asyncOperation1 () {
            return new Cypress.Promise((resolve) => {
                setTimeout(() => {
                    cy.log('Async Operation 1 completed');
                    resolve('Result from Operation 1');
                }, 1000);
            });
        }

        function asyncOperation2 (data) {
            return new Cypress.Promise((resolve) => {
                setTimeout(() => {
                    cy.log('Async Operation 2 completed');
                    resolve(`Result from Operation 2 using ${data}`);
                }, 1500);
            });
        }
        
        //chaining promises
        cy.wrap(null).then(() => {
            return asyncOperation1()
            .then(data1 => asyncOperation2(data1))
            .then(dataFinal => {
                cy.log('Final result: ', dataFinal);
                cy.wrap(dataFinal).should('deep.equal', 'Result from Operation 2 using Result from Operation 1');
            })
            .catch(error => {
                cy.log('Error message: ', error);
            });
        });
    })

    it('calling a sum function from the backend, cy.task', () => {
        cy.task('calculateSum', { a: 6, b: 1 }).then((result) => {
            cy.task('logMessage', result);
            expect(result).to.equal(7);
        })
    })
})