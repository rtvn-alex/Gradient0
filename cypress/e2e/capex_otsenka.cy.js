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

    let inputLeft = '.TextField:nth-child(1) .TextField-Input'
    let inputRight = '.TextField:nth-child(2) .TextField-Input'
    let sliderLeft = 'button[aria-label="0-button"]'
    let sliderRight = 'button[aria-label="1-button"]'

    
    beforeEach(() => {
        navigate()
        auth()
        enterGradient(Cypress.env('capexSkv'))
        clickAnElement('Оценка')
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_13/data?loadDataCapex').as('loadDataCapex')
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_9/data?elDynamic').as('elDynamic')
    })


    it.only('should check the top scroll', () => {
        cy.wait(3000)
        clickAnElement('Гибкий')
        cy.wait(1000)
        cy.get(inputLeft).should('have.attr', 'value').then((valLeft) => {
            // ТЕСТИТЬ ЗАПРОСЫ ПРИ ОТСУТСТВИИ КОНКРЕТНЫХ ЗНАЧЕНИЙ НЕОПРАВДАННО СЛОЖНО
            //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_13/data?loadDataCapex').as('loadDataCapex')    
            dragAndDrop(sliderLeft, 50)
            //waitForRequest('@loadDataCapex', {body: {filters: {othod_ot_vertikali: [`=`, ``]}}}, 10)
            //cy.get('@loadDataCapex').its('request.body.filters.othod_ot_vertikali[1]').should('not.eq', valLeft)
            cy.get(inputRight).should('have.attr', 'value').then((valRight) => {
                dragAndDrop(sliderRight, 250)
                //cy.wait('@loadDataCapex').its('request.body.filters.othod_ot_vertikali[2]').should('not.eq', valRight)
                takeProperty(inputLeft, 'value', valLeft, false)
                takeProperty(inputRight, 'value', valRight, false)
            })
        })
    })


    it('should check the top inputs', () => {
        cy.wait(3000)
        clickAnElement('Гибкий')
        cy.wait(1000)
        cy.get(inputRight).should('have.attr', 'value').then((valRight) => {
            let val = Number(valRight)
            let numRight = ~~ (val * 0.9)
            let numLeft = ~~ (val * 0.1)
            let textRight = numRight.toString()
            let textLeft = numLeft.toString()

            cy.get(sliderRight).should('have.attr', 'aria-valuenow').then((posRight) => {
                typeIt(inputRight, textRight)
                cy.wait(500)
                takeProperty(sliderRight, 'aria-valuenow', posRight, false)
            })

            cy.get(sliderLeft).should('have.attr', 'aria-valuenow').then((posLeft) => {
                typeIt(inputLeft, textLeft)
                cy.wait(500)
                takeProperty(sliderLeft, 'aria-valuenow', posLeft, false)
          })
        })
    })




})