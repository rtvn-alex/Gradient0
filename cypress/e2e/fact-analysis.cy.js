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
    endingsCheck
} from "../../page-objects/functions.js"


describe('basic tests', () => {
    beforeEach(() => {
        navigate()
        //cy.wait(3000)
        auth()
        //cy.wait(3000)
        enterGradient()
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








})