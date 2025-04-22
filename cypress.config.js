const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return config;
    },
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    
    specPattern: "cypress/e2e/**/*.cy.js",        // 👈 fuerza el path de tests
    supportFile: "cypress/support/e2e.js",         // 👈 path explícito si usás support
    fixturesFolder: "cypress/fixtures",
    screenshotsFolder: "cypress/screenshots",      // 👈 salida screenshots
    videosFolder: "cypress/videos",                // 👈 salida videos
    chromeWebSecurity: false,
    viewportWidth: 1360,
    viewportHeight: 768,
  },
  
  video: true,
  screenshotOnRunFailure: true,
});
