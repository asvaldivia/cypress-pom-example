import {faker} from '@faker-js/faker';

// This function generates personal data for testing purposes.
// This function will be called on a cy.generateUserData command
export function getPersonalData() {
    const personalData = {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email()
    }
    return personalData;
}
