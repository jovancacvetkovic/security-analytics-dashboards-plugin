const { defineConfig } = require('cypress');

module.exports = defineConfig({
  defaultCommandTimeout: 60000,
  requestTimeout: 60000,
  responseTimeout: 60000,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  viewportWidth: 2000,
  viewportHeight: 1320,
  env: {
    openSearchUrl: 'localhost:9200',
    openSearchDashboards: 'http://localhost:5601',
    SECURITY_ENABLED: false,
    username: 'admin',
    password: 'admin',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins')(on, config);
    },
    baseUrl: 'http://localhost:5601',
  },
  retries: 1,
});
