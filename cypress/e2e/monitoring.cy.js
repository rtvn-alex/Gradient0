/// <reference types="cypress" />


import {
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    waitForElement,
    shouldContainText,
    scrollDown,
    scrollUp,
    waitForElementIsAbsent
} from "../../page-objects/functions.js"


describe('basic tests', () => {
    beforeEach(() => {
        navigate()
        cy.wait(3000)
        auth()
        cy.wait(3000)
        enterGradient()
        cy.wait(3000)
        clickAnElement('Мониторинг')
        cy.wait(5000)
    })


    it('should check the page and elements', () => {
        cy.wait(5000)
        waitForElement('article.GradientVizel:nth-of-type(3)')                                                    //загружается 3 график
        //waitForElement('.DsShell__Body > :nth-child(4)')
        cy.get(('div.MainPane__SwitchViewButtons>button.AppButton.active span')).should('have.text', 'График')       //Переключатель в состоянии "График"                       
        cy.contains('руб./тн').should('exist')                                                                       //Установлена размерность 'руб./тн'
        cy.get('li.PaneList__Item.active>div').eq(0).should('have.text', 'Все процессы')                             //Установлено "Все процессы"
        cy.get('li.PaneList__Item.active>div').eq(1).should('have.text', 'Транспорт')                                //Выбрана статья "Транспорт"
        cy.get('div.GradientVizel__Potencial_Chart_GBar_Box').eq(2)                                                  //Непрозрачный сектор столбика
          .should('have.attr', 'style').and('contain', 'opacity: 1')
    })


    it('should check deleting of header filters', () => {
        let fact19 = Cypress.env('somePeriod')
        let co26 = Cypress.env('someCO')
        scrollDown()
        cy.contains('div.GBarChart__XAxisTitle', fact19).should('be.visible')
        cy.contains('span.GBarChart__EtalonTitle', co26).should('be.visible')
        scrollUp()
        cy.contains('div.HeaderFilter', fact19).children('button').click()
        cy.contains('div.HeaderFilter', co26).children('button').click()
        scrollDown()
        cy.contains(fact19).should('not.be.visible')
        cy.contains(co26).should('not.be.visible')
    })


    it.only('should check deleting of filters via the list', () => {
        clickAnElement('Настроить')
        waitForElement('div.DsShellPanelLocations')
        clickAnElement('Очистить все')

        cy.document().then((doc) => {
            let marks = doc.querySelectorAll('span.AppCheckbox__checkmark')
            marks.forEach((mark) => {
                cy.get(mark).should('not.be.checked')
            })
        })

        clickAnElement('Применить')
        cy.wait(1000)
        waitForElementIsAbsent('span.Tag:nth-of-type(2)')
        cy.document().then((doc) => {
            //let graphs = doc.querySelectorAll('div.GBarChart__Main>')
            //graphs.forEach((graph) => {
            let graphsQuantity = doc.querySelectorAll('div.GBarChart__Main').length
            let blocksQuantity = doc.querySelectorAll('div.GBarChart__XAxisBlock').length
            expect(blocksQuantity).not.to.be.moreThan(graphsQuantity)
            //})
        })
    })


})