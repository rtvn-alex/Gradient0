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
    switchLeftPaneElements,
    shouldContainText,
    shouldHaveText
} from "../../page-objects/functions.js"


describe('demo actions', () => {
    beforeEach(() => {
        navigate()
        auth()
    })


    it('should turn the screens through', () => {
        let basic = Cypress.env('diagramSelector')
        let alter = Cypress.env('diagramSelectorAlternative')
        enterGradient(Cypress.env('lcNeft'))
        clickAnElement('Оценка потенциала')
        showElement(alter)
        cy.wait(1500)
        clickAnElement('Моделирование')
        showElement(alter)
        cy.wait(1500)
        clickAnElement('Мониторинг')
        showElement(alter)
        for (let i = 2; i <= 4; i++){
            waitForElement(alter + `:nth-of-type(${i}n)`)
        }
        clickAnElement('...')    // button.AppButton.SubMenuButton
        clickAnElement('Аналитика')
        showElement(basic)
        for (let i of ['2', '3']){
            waitForElement(basic + `:nth-of-type(${i}n)`)
        }
        cy.wait(1500)
        clickAnElement('...')
        clickAnElement('Динамика метрик')
        showElement(alter)
        cy.wait(1500)
        clickAnElement('...')
        clickAnElement('анализ')
        showElement(alter)
    })


    it.only('should turn the CAPEX screens through', () => {
        let select = Cypress.env('diagramSelectorAlternative')
        enterGradient(Cypress.env('capexSkv'))
        cy.wait(1500)
        clickAnElement('Динамика метрик')
        showElement(select)
        cy.wait(1500)
        clickAnElement('Оценка потенциала')
        showElement(select)
    })


    it('should switch colour themes', () => {
        enterGradient(Cypress.env('lcNeft'))
        clickAnElement('Аналитика')
        cy.wait(1500)
        cy.get('body.noselect').should('have.attr', 'data-theme').and('equal', 'light')        
        cy.get(".DsShellHeader__ThemeSwitcher>svg").click()
        cy.wait(1500)
        cy.get('body.noselect').should('have.attr', 'data-theme').and('equal', 'dark')
        cy.get(".DsShellHeader__ThemeSwitcher>svg").click()
        cy.wait(1500)
        cy.get('body.noselect').should('have.attr', 'data-theme').and('equal', 'light')
    })


    it('should change an active', () => {
        enterGradient(Cypress.env('lcNeft'))
        clickAnElement('Аналитика')
        cy.wait(3000)
        clickAnElement('Ямал')
        clickAnElement('Хантос')
        shouldContainText('.GBarChart__Main .GBarChart__XAxisBlock.first', 'Хантос')
        clickAnElement('Хантос')
        clickAnElement('Восток')
        shouldContainText('.GBarChart__Main .GBarChart__XAxisBlock.first', 'Восток')
    })


    it('should change a subactive', () => {
        let str = 'МР № 35'
        enterGradient(Cypress.env('lcNeft'))
        clickAnElement('Оценка')
        cy.wait(3000)
        //waitForElement('.DsShellHeader > :nth-child(6)')
        cy.get(':nth-child(6) > .AppSelect__TextField').click()
       //clickAnElement('Не выбрано')
        clickAnElement(str)
        shouldHaveText('div.MainPane__TagsGroup span:nth-child(1) span', str)
    })


    it('should open the Download window', () => {
        enterGradient(Cypress.env('lcNeft'))
        clickAnElement('Аналитика')
        cy.wait(1500)
        cy.get('div.UserBadge__Name', {timeout:10000}).click()
        clickAnElement('Выгрузка базы')
        cy.get('.OpenModalContainer__Content .UnloadingModal')
    })
    
    
    it('should check downloading of PDF', () => {
        enterGradient(Cypress.env('lcNeft'))
        clickAnElement('Оценка')
        cy.wait(3000)
        cy.get('div.UserBadge__Name', {timeout:10000}).click()
        clickAnElement('PDF')
        cy.readFile('./cypress/downloads/presentation.pdf', {timeout:20000})
    })


    it('should switch the processes and articles', () => {
        enterGradient(Cypress.env('lcNeft'))
        clickAnElement('Аналитика')
        cy.wait(3000)
        switchLeftPaneElements('div.Header div', Cypress.env('processes'))
        switchLeftPaneElements('div.GradientVizel__Title', Cypress.env('articles'))
    })
})
