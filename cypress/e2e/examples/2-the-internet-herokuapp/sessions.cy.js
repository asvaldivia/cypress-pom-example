describe('handling sessions', () => {

    before(() => {
        // start the session for the user here
        cy.login('tomsmith', 'SuperSecretPassword!');
        
    })

    it('should exist the logout button handling session', () => {
        // test that can access to the session assert logout button exist, creating a new command with the session
        // logic and calling it from a before hook
        // the sequence is the following:
        // 1. Login --> cookie response is a rack.session
        // 2. Auth --> uses the login rack.session and response an Auth rack.session
        // 3. Secure --> uses the auth rack.session and response an Secure rack.session
        // the last cookie needs to be retrieve to access directly to the /secure domain
        
        cy.request({
            method: 'GET',
            url: 'https://the-internet.herokuapp.com/secure',
            headers: {
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'max-age=0',
              Connection: 'keep-alive',
              Cookie: 'optimizelySegments=%7B%7D; optimizelyEndUserId=oeu1707434218884r0.8333697889499467; optimizelyBuckets=%7B%7D; rack.session=' + Cypress.env('sessionCookie'),
              Referer: 'https://the-internet.herokuapp.com/login',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'same-origin',
              'Sec-Fetch-User': '?1',
              'Upgrade-Insecure-Requests': '1',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
              'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"macOS"'
            },
            followRedirect: false, // Prevent following redirects
            failOnStatusCode: false // Don't fail the test on non-2xx status codes
          }).then(($response) => {
            // Do something with the response
            // cy.setCookie('rack.session', Cypress.env('sessionCookie'));
            cy.log(cy.getCookie('rack.session'));
          });
    })
})
