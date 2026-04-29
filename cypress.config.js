const { defineConfig } = require("cypress");
const path = require('path');

module.exports = defineConfig({
  projectId: "rynzrb",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // implementing task, which is useful to perform actions in node, outside web context
      // a use case can be: read a file, seed a database before test, etc
      on('task', {
        logMessage (message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message)
    
          return null
        },
        calculateSum({ a, b }) {
          return a + b;
        },
        dbSeed(){
          const seedModule = require('./cypress/db/seed.js');
          return seedModule.seed();
        },
        dbTearDown(){
          const teardownModule = require('./cypress/db/teardown.js')
          return teardownModule.tearDown();
        },
        async checkHealth(url) {
          console.log(`\n[Health Check Task] Attempting to ping: ${url}\n`);
          try {
            const response = await fetch(url);

            console.log(`[Health Check Task] Response Status: ${response.status}`);

            return response.ok; // returns true for status 200-299
          } catch (error) {

            console.error(`[Health Check Task] Failed: ${error.message}`);

            return false;
          }
        }
      })
    }
  },
  video: true,
  chromeWebSecurity: false,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,        
    html: false,
    json: true,
  },
});
