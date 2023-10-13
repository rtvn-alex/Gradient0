// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    if ((err.message.includes('dataPeriods'))
    || (err.message.includes('cancel 0'))) {
            // we expected this error, so let's ignore it
            // and let the test continue
                return false
            }
})

/*
Cypress.on('fail', (e, runnable) => {
    cy.log('error', e)
    cy.log('=============================================================================================')
    if (e.message.includes('ul.AppTree__ChildList>li.AppTree__Item:not(.hidden)')) {
        return false
    }
})
*/

  // inspect the caught error
