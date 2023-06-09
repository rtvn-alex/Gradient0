/// <reference types="cypress" />

import {
    navigate,
    auth,
    clickAnElement,
    enterGradient
} from "../../page-objects/functions.js"


describe('demo actions', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient()
    })
/*
    it('can be ignored', () => {        
        cy.on('uncaught:exception', (err, runnable) => {
            //console.log('error', e)
            //console.log('runnable', runnable)
    
            // we can simply return false to avoid failing the test on uncaught error
            // return false
            // but a better strategy is to make sure the error is expected
            if (err.message.includes('TypeError: dataPeriods.filter is not a function')) {
            // we expected this error, so let's ignore it
            // and let the test continue
                return false
            }
            // on any other error message the test fails
        })
    })
*/
/*
    it('should open the project page', () => {
       // cy.contains('Визуализации').click()
       // cy.contains('Lifting cost').click()
       clickAnElement('Визуализации')
       clickAnElement('Lifting cost')
    })
*/


    it('should turn the screens through', () => {
        clickAnElement('Визуализации')
        //cy.get('.DatasetsListView').scrollTo('top')
        clickAnElement('Аналитика')
        //cy.wait(3000)
        clickAnElement('Динамика метрик')
        // cy.wait(3000)
        clickAnElement('Выявление эталонов')
        cy.wait(3000)
        clickAnElement('Оценка потенциала')
        cy.wait(3000)
        clickAnElement('анализ')
        cy.wait(3000)
        clickAnElement('Мониторинг')
    })
})



/*
it('should authentificate the user', () => {
    cy.visit('https://dev-ibs.luxmsbi.com/')
    cy.get('input[autocomplete="username"]').type(Cypress.env('login'))
    cy.get('input[autocomplete="current-password"]').type(Cypress.env('password') + '{enter}')
})
*/

