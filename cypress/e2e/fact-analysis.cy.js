/// <reference types="cypress" />

//import { should } from "chai"
import { 
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    shouldContainText, 
    shouldHaveText, 
    waitForElement, 
    endingsCheck,
    switchLeftPaneElements,
    numberFromString,
    popupsCheck,
    numberFromElementText
} from "../../page-objects/functions.js"


describe('basic tests', () => {
    beforeEach(() => {
        navigate()
        //cy.wait(3000)
        auth()
        //cy.wait(3000)
        enterGradient(Cypress.env('lcNeft'))
        //cy.wait(3000)
        clickAnElement('Факторный анализ')
        //cy.wait(5000)
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_7/data?el').as('dataEl')
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_7/data?units').as('dataUnits')
    })


    it('should check the page and elements', () => {
        cy.wait(5000)
        waitForElement('div.GbarCharts')
        shouldHaveText('div > div.MainPane__PeriodsSelectLabel', '12+0')
        shouldHaveText('div.CustomDatePickerTrigger > span', '2022')
        shouldHaveText('li.PaneList__Item.active > div', 'Транспорт')
        endingsCheck()
    })


    it('should check plan+fact changing', () => {
        let fp = '3+9'
        waitForElement('div.GradientVizel__Charts')
        clickAnElement('12+0')
        clickAnElement(fp)
        shouldContainText('div.GradientVizel__Title', fp)
        endingsCheck()
        cy.get('@dataEl').then((xhr) => {
            expect(xhr.request.body.filters.mnt_period[1]).to.be.eq(fp)
        })
        cy.get('@dataUnits').then((xhr) => {
            expect(xhr.request.body.filters.mnt_period[1]).to.be.eq(fp)
        })
    })


    it('should check year changing', () => {
        let yer = '2020'
        clickAnElement('2022')
        clickAnElement(yer)
        shouldContainText('div.GradientVizel__Title', yer)
        endingsCheck()
        cy.get('@dataEl').then((xhr) => {
            expect(xhr.request.body.filters.dt[1]).to.be.eq(yer)
        })
        cy.get('@dataUnits').then((xhr) => {
            expect(xhr.request.body.filters.dt[1]).to.be.eq(yer)
        })
    })


    it('should switch articles', () => {
        switchLeftPaneElements('li.GBreadcrumbs__Item > span', Cypress.env('articles'))
    })


    it('should check changing of actives', () => {
        // Тестируются только запросы;
        // Подактивы (пока?) не переключаются

        //const act = Cypress.env('someAct')
        const act = 'Хантос'
        clickAnElement('Ямал')
        clickAnElement(act)
        cy.wait(3000)
        cy.get('@dataEl').then((xhr) => {
            expect(xhr.request.body.filters.do_code[1]).to.be.eq(4)
        })
        cy.get('@dataUnits').then((xhr) => {
            expect(xhr.request.body.filters.do_code[1]).to.be.eq(4)
        })
    })


    it('should check appearing of pop-ups when pointing on elements', () => {
        cy.wait(5000)
        cy.document().then((doc) => {
            let lines = doc.querySelectorAll('div.GbarHorizontal__Line')
            lines.forEach((line) => {
                cy.get(line).siblings('.GbarHorizontal__Percent').find(':nth-child(11) > .GbarHorizontal__Units_Value').then((val) => {
                    let num = numberFromString(val.text())
                    if (num != 0) {
                        cy.get(line).find('.BackgroundStandart').then((firstLine) => {
                            popupsCheck(firstLine)
                        })
                    }
                })
            })
        })
    })


    it('should check navigation', () => {
        let txt = Cypress.env('breadCrumbs')[1]
        waitForElement('div.GradientVizel__Charts')
        cy.contains('li.GBarChartWithTabs__Tab', txt).click()
        //cy.wait(3000)
        cy.get('.GBreadcrumbs__Item > span').last().should('have.text', txt)
        shouldContainText('div.GradientVizel__Title', txt)

        cy.get('@dataEl').then((xhr) => {
            expect(xhr.request.body.filters.cost_sub_categories_id[1]).to.be.eq(112)
        })
        cy.get('@dataUnits').then((xhr) => {
            expect(xhr.request.body.filters.cost_sub_categories_id[1]).to.be.eq(112)
        })
    })
    

    it('should check directing to Modeling page', () => {
        cy.wait(3000)
        cy.get('div.GbarHorizontal__Line').first().trigger('mouseenter')                   // эту строчку лучше не удалять
        cy.get('div.GbarHorizontal:first-of-type .BackgroundMain').trigger('mouseenter')
        clickAnElement('Подробнее')
        cy.wait(3000)
        cy.url().should('include', 'ds_brd_gradient_6')
        shouldContainText('.DashBoardPicker button.active', 'Моделирование')
    })
})