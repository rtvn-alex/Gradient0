/// <reference types="cypress" />


import {
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    shouldHaveText,
    shouldContainText,
    showElement, 
    waitForElement,
    waitForElementIsAbsent,
    parseToJSON,
    isAndIsnt,
    waitForRequest,
    takeProperty,
    dragAndDrop,
    typeIt
} from "../../page-objects/functions.js"


describe('actions', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient(Cypress.env('capexSkv'))
        clickAnElement('Оценка')
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_13/data?loadDataCapex').as('loadDataCapex')
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_9/data?elDynamic').as('elDynamic')
    })


    it('should check the top scroll', () => {                                                     // БАГ - НУЖНО ПРОВЕРИТЬ НА ОЦЕНКЕ ПОТЕНЦИАЛА, ТАМ РАБОТАЕТ
        cy.wait(3000)
        clickAnElement('Гибкий')
        cy.wait(1000)
        //cy.get('input.TextField-Input').first().should('have.attr', 'max')
        //cy.log(val)
/*
        cy.get('button[aria-label="0-button"]')
          .invoke('val', 3000)
          .trigger('change', { force: true })
        */
        // //takeProperty('div.TextField:first-child input.TextField-Input', 'value').and('not.eq', 0)
        // cy.wait(1500)
        // cy.get('input.TextField-Input').first().should('have.attr', 'value').and('be.not.eq', '0')

          /*.trigger('mousemove')
          .trigger('mouseDown')
          .trigger('mousemove
          ', {})
          */ 
                                                         // НЕМНОГО РАБОТАЕТ
                                                         /*
        cy.get('button[aria-label="0-button"]')
          .trigger('mousedown')
          .trigger('mousemove', {clientX: 150})
          .trigger('mousemove', {clientX: 50})     //clientY: 292
          .trigger('mouseup', {force: true})
          .click()
          */
/*
        cy.get('button[aria-label="0-button"]')
          .trigger('mousedown')
          .trigger('mousemove', {clientX: 50, force: true})     //clientY: 292
          .trigger('mouseup', {force: true})

        cy.get('button[aria-label="1-button"]')
          .trigger('mousedown')
          .trigger('mousemove', {clientX: 250, force: true})     //clientY: 292
          .wait(1000)                                            // Непонятно, но зачем-то надо
          .trigger('mouseup', {force: true})   
          */
        
          //dragAndDrop('button[aria-label="0-button"]', 50)
          //dragAndDrop('button[aria-label="1-button"]', 250)
          
        cy.get('input.TextField-Input').first().should('have.attr', 'value').then((valLeft) => {
            //cy.log(val)
            dragAndDrop('button[aria-label="0-button"]', 50)
            cy.get('input.TextField-Input').last().should('have.attr', 'value').then((valRight) => {
                dragAndDrop('button[aria-label="1-button"]', 250)
                cy.get('input.TextField-Input').first().should('have.attr', 'value').and('not.eq', valLeft)
                cy.get('input.TextField-Input').last().should('have.attr', 'value').and('not.eq', valRight)
            })
        })
    })


    it.only('should check the top inputs', () => {
        cy.wait(3000)
        clickAnElement('Гибкий')
        cy.wait(1000)
        cy.get('input.TextField-Input').last().should('have.attr', 'value').then((valRight) => {
            let val = Number(valRight)
            let numRight = ~~ (val * 0.9)
            let numLeft = ~~ (val * 0.1)
            let textRight = numRight.toString()
            let textLeft = numLeft.toString()

            cy.get('button[aria-label="1-button"]').should('have.attr', 'aria-valuenow').then((posRight) => {
                typeIt('div.TextField:last-child input.TextField-Input', textRight)
                cy.wait(500)
                cy.get('button[aria-label="1-button"]').should('have.attr', 'aria-valuenow').and('not.eq', posRight)
            })

            cy.get('button[aria-label="0-button"]').should('have.attr', 'aria-valuenow').then((posLeft) => {
              typeIt('div.TextField:first-child input.TextField-Input', textLeft)
              cy.wait(500)
              cy.get('button[aria-label="0-button"]').should('have.attr', 'aria-valuenow').and('not.eq', posLeft)
          })
        })
    })




})