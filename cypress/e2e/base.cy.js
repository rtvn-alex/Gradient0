/// <reference types="cypress" />

import {
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    showElement,
    waitForElement,
    searchProcessInHeader,
    searchArticleInHeader,
    switchLeftPaneElements
} from "../../page-objects/functions.js"


describe('demo actions', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient()
    })


    it('should turn the screens through', () => {
        clickAnElement('Оценка потенциала')
        showElement(Cypress.env('diagramSelectorAlternative'))
        cy.wait(1500)
        clickAnElement('Моделирование')
        showElement(Cypress.env('diagramSelectorAlternative'))
        cy.wait(1500)
        clickAnElement('Мониторинг')
        showElement(Cypress.env('diagramSelectorAlternative'))
        for (let i of ['2', '3', '4']){
            waitForElement(Cypress.env('diagramSelectorAlternative') + `:nth-of-type(${i}n)`)
        }
        clickAnElement('...')    // button.AppButton.SubMenuButton
        clickAnElement('Аналитика')
        showElement(Cypress.env('diagramSelector'))
        for (let i of ['2', '3']){
            waitForElement(Cypress.env('diagramSelector') + `:nth-of-type(${i}n)`)
        }
        cy.wait(1500)
        clickAnElement('...')
        clickAnElement('Динамика метрик')
        showElement(Cypress.env('diagramSelectorAlternative'))
        cy.wait(1500)
        clickAnElement('...')
        clickAnElement('анализ')
        showElement(Cypress.env('diagramSelectorAlternative'))
        cy.wait(1500)
    })

    it('should switch colour themes', () => {
        clickAnElement('Аналитика')
        cy.get('body.noselect').should('have.attr', 'data-theme').and('equal', 'dark')
        cy.get(".DsShellHeader__ThemeSwitcher>svg").click()
        cy.wait(1500)
        cy.get('body.noselect').should('have.attr', 'data-theme').and('equal', 'light')
        cy.get(".DsShellHeader__ThemeSwitcher>svg").click()
        cy.wait(1500)
        cy.get('body.noselect').should('have.attr', 'data-theme').and('equal', 'dark')
    })

    it('should change an active', () => {
        clickAnElement('Аналитика')
        cy.wait(1500)
        clickAnElement('Ямал')
        clickAnElement('Хантос')
        cy.get('.GBarChart__Main .GBarChart__XAxisBlock.first').should('contain.text', 'Хантос')
        clickAnElement('Хантос')
        clickAnElement('Восток')
        cy.get('.GBarChart__Main .GBarChart__XAxisBlock.first').should('contain.text', 'Восток')
    })

    it('should change a subactive', () => {
        clickAnElement('Оценка')
        cy.wait(3000)
        clickAnElement('Не выбрано')
        clickAnElement('Новопортовское')
        cy.get('div.MainPane__TagsGroup span:nth-child(1) span').should('have.text', 'Новопортовское')
    })

    it.skip('should switch the processes', () => {
        // переведено в тест 'should switch the processes and articles'
        clickAnElement('Аналитика')
        cy.wait(3000)
        Cypress.env('processes').forEach(el => {
            searchProcessInHeader(el)
        })
    })

    it.skip('should switch the articles', () => {
        // переведено в тест 'should switch the processes and articles'
        clickAnElement('Аналитика')
        cy.wait(3000)
        Cypress.env('articles').forEach(el => {
            searchArticleInHeader(el)
        })
    })

    it('should open the Download window', () => {
        clickAnElement('Аналитика')
        cy.wait(1500)
        cy.get('div.UserBadge__Name', {timeout:10000}).click()
        clickAnElement('Выгрузка')
        cy.get('.OpenModalContainer__Content .UnloadingModal')
    })

    it('should switch the processes and articles', () => {
        clickAnElement('Аналитика')
        cy.wait(3000)
        switchLeftPaneElements('div.Header div', Cypress.env('processes'))
        switchLeftPaneElements('div.GradientVizel__Title', Cypress.env('articles'))
    })
})
