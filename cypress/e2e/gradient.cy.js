/// <reference types="cypress" />

import {
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    showElement,
    waitForElement,
    searchProcessInHeader,
    searchArticleInHeader
} from "../../page-objects/functions.js"


describe('demo actions', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient()
    })


    it('should turn the screens through', () => {
        //checks for every diagramm on every screen to appear
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

    it('should switch colour themes', () => {
        cy.get('body.noselect').should('have.attr', 'data-theme').and('equal', 'light')
        cy.get("span[title='Переключить тему']").click()
        cy.wait(1500)
        cy.get('body.noselect').should('have.attr', 'data-theme').and('equal', 'dark')
        cy.get("span[title='Переключить тему']").click()
        cy.wait(1500)
        cy.get('body.noselect').should('have.attr', 'data-theme').and('equal', 'light')
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
        clickAnElement('Выявление')
        cy.wait(3000)
        clickAnElement('Не выбрано')
        clickAnElement('Новопортовское')
        cy.get('div.MainPane__TagsGroup span:nth-child(1) span').should('have.text', 'Новопортовское')
    })

    it('should switch the processes', () => {
        clickAnElement('Аналитика')
        cy.wait(3000)
        searchProcessInHeader('Подъем УВС')
        searchProcessInHeader('ППД')
        searchProcessInHeader('Подготовка нефти')
        searchProcessInHeader('Подготовка газа')
        searchProcessInHeader('Транспортировка УВС')
        searchProcessInHeader('Все процессы')
    })

    it('should switch the articles', () => {
        clickAnElement('Выявление')
        cy.wait(3000)
        searchArticleInHeader('Материалы')
        searchArticleInHeader('Электроэнергия')
        searchArticleInHeader('Персонал')
        //searchArticleInHeader('Транспорт')
        searchArticleInHeader('ГНО')
        searchArticleInHeader('НКТ')
        searchArticleInHeader('Прочие')
        searchArticleInHeader('Все статьи затрат')
    })
})
