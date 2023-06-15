/// <reference types="cypress" />

import {
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    showElement,
    waitForElement
} from "../../page-objects/functions.js"


describe('demo actions', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient()
    })


    it('should turn the screens through', () => {
        clickAnElement('Визуализации')
        clickAnElement('Аналитика')
        showElement(Cypress.env('diagramSelector'))
        for (let i of ['2', '3']){
            waitForElement(Cypress.env('diagramSelector') + `:nth-of-type(${i}n)`)
        }
        cy.wait(1500)
        clickAnElement('Динамика метрик')
        showElement(Cypress.env('diagramSelector'))
        cy.wait(1500)
        clickAnElement('Выявление эталонов')
        showElement(Cypress.env('diagramSelectorAlternative'))
        cy.wait(1500)
        clickAnElement('Оценка потенциала')
        showElement(Cypress.env('diagramSelector'))
        cy.wait(1500)
        clickAnElement('анализ')
        showElement(Cypress.env('diagramSelector'))
        cy.wait(1500)
        clickAnElement('Мониторинг')
        showElement(Cypress.env('diagramSelectorAlternative'))
        for (let i of ['2', '3', '4']){
            waitForElement(Cypress.env('diagramSelectorAlternative') + `:nth-of-type(${i}n)`)
        }
    })
})


