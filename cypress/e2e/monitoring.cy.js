/// <reference types="cypress" />


import {
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    waitForElement,
    shouldContainText
} from "../../page-objects/functions.js"


describe('basic tests', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient()
        clickAnElement('Мониторинг')
    })


    it.only('should check the page and elements', () => {
        waitForElement('article.GradientVizel:nth-of-type(3)')                                                       //загружается 3 график
        cy.get(('div.MainPane__SwitchViewButtons>button.AppButton.active span')).should('have.text', 'График')       //Переключатель в состоянии "График"                       
        cy.contains('руб./тн').should('exist')                                                                       //Установлена размерность 'руб./тн'
        cy.get('li.PaneList__Item.active>div').eq(0).should('have.text', 'Все процессы')                             //Установлено "Все процессы"
        cy.get('li.PaneList__Item.active>div').eq(1).should('have.text', 'Транспорт')                                //Выбрана статья "Транспорт"
        cy.get('div.GradientVizel__Potencial_Chart_GBar_Box').eq(2)                                                  //Непрозрачный сектор столбика
          .should('have.attr', 'style').and('contain', 'opacity: 1')
    })


    it('should check header filters', () => {
/// skip it
    })




})