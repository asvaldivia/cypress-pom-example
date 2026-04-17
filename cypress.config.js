const { defineConfig } = require("cypress");
const path = require('path');
const http = require('http');

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
        checkHealth(url) {
          return new Promise((resolve) => {
            http.get(url, (res) => {
              // service up, resolve true
              resolve(res.statusCode === 200);
            }).on('error', () => {
              // otherwise, servide is down, resolve false
                resolve(false);
              });
           });
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
