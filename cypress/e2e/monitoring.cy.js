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
    waitForElementIsAbsent,
    switchLeftPaneElements
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
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_4/data?units').as('dataUnits')
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/koob/data?elPotencial').as('elPotencial')
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_4/data?elMonitoring').as('elMonitoring')
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


    it.skip('should check deleting and adding of filters via the list', () => {
        // Нужно разобраться с подсчётом столбиков - см. ниже

        clickAnElement('Настроить')
        waitForElement('div.DsShellPanelLocations')
        clickAnElement('Очистить все')

        cy.document().then((doc) => {
            let marks = doc.querySelectorAll(Cypress.env('checkboxSelector'))
            marks.forEach((mark) => {
                cy.get(mark).should('not.be.checked')
            })
        })

        clickAnElement('Применить')
        cy.wait(1000)
        waitForElementIsAbsent('span.Tag:nth-of-type(2)')
        cy.document().then((doc) => {
            let graphsQuantity = doc.querySelectorAll('div.GBarChart__Main').length
            let blocksQuantity = doc.querySelectorAll('div.GBarChart__XAxisBlock').length
            expect(blocksQuantity).not.to.be.above(graphsQuantity)
        })

        clickAnElement('Настроить')
        waitForElement('div.DsShellPanelLocations')
        cy.document().then((doc) => {
            let marks = doc.querySelectorAll(Cypress.env('checkboxSelector'))
            marks.forEach((mark) => {
                cy.get(mark).click()
            })
        })
        
        clickAnElement('Применить')
        scrollDown()
        cy.document().then((doc) => {
            cy.wait(3000)
            let graphsQuantity = doc.querySelectorAll('div.GBarChart__Main').length                                                                   // графики
            let periodsCheckboxesQuantity = doc.querySelectorAll('section.DsShellPanelLocations__MainSection:first-of-type label').length             // верхние чекбоксы
            let orientsCheckboxesQuantity = doc.querySelectorAll('section.DsShellPanelLocations__MainSection:nth-of-type(2) label').length            // нижние чекбоксы
            let blocksQuantity = doc.querySelectorAll('div.GBarChart__Bar').length                                                                    // столбики
            let linesQuantity = doc.querySelectorAll('div.GBarChart__EtalonLine').length                                                              // линии
            cy.log(graphsQuantity, blocksQuantity, linesQuantity, periodsCheckboxesQuantity, orientsCheckboxesQuantity)

            //expect(blocksQuantity).to.be.eq((periodsCheckboxesQuantity + 1) * graphsQuantity)                                                       // УЗНАТЬ, ПОЧЕМУ ВИДНЫ 4 ВМЕСТО 20 

            expect(linesQuantity).to.satisfy((lines) => {
                return lines === orientsCheckboxesQuantity * graphsQuantity || lines === graphsQuantity * 2
            })
        })
    })


    it('should check months changing', () =>{
        let month = 'Июнь'
        let headers = [
            ':nth-child(2) > .GradientVizel__Scatter_Wrapper > .GradientVizel__Scatter_Title',
            ':nth-child(3) > .GradientVizel__Scatter_Wrapper > .GradientVizel__Scatter_Title',
            '.GradientVizel__Title'
        ]

        headers.forEach((header) => {
            cy.get(header).should('not.contain.text', month)
        })
        clickAnElement('Декабрь 2022')
        clickAnElement(month.toLowerCase())

        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_4/data?units').as('dataUnits')
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/koob/data?elPotencial').as('elPotencial')
        cy.get('@dataUnits').then((xhr) => {
            expect(xhr.request.body.filters.mnt_period[1]).to.be.eq('6+6')
        })
        cy.wait(500)
        cy.get('@elPotencial').then((xhr) => {
            expect(xhr.request.body.filters.mnt_period[1]).to.be.eq('6+6')
        })

        headers.forEach((header) => {
            cy.get(header).should('contain.text', month)
        })
    })


    it('should check units changing', () => {
        cy.get('div.MeasureSelect__Select span.AppSelect__TextField').click()
        clickAnElement(Cypress.env('someUnit'))
        cy.wait('@elMonitoring').then((xhr) => {
            expect(xhr.request.body.filters.unit_id[1]).to.be.eq(177)
        })
        scrollDown()
        cy.get('h2.GBar__Unit').first().should('have.text', Cypress.env('someUnit'))
    })


    it('should check the "graph-table" switcher', () => {
        scrollDown()
        clickAnElement('Таблица')
        cy.get('table.GradientTable__Table').should('exist').and('be.visible')
        waitForElementIsAbsent('li.GradientVizel__Chart')
        clickAnElement('График')
        cy.get('li.GradientVizel__Chart').should('exist').and('be.visible')
        waitForElementIsAbsent('table.GradientTable__Table')
    })


    it.only('should switch the processes and articles', () => {
        switchLeftPaneElements('li.GBreadcrumbs__Item > span', Cypress.env('articles'))
        switchLeftPaneElements('li.GBreadcrumbs__Item > span', Cypress.env('processes'))
    })
})