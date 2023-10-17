/// <reference types="cypress" />

//import { should } from "chai"
import { 
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    shouldContainText, 
    shouldHaveText, 
    waitForElement 
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
    })


    it('should check the page and elements', () => {
        cy.wait(5000)
        waitForElement('div.GbarCharts')
        shouldHaveText('div > div.MainPane__PeriodsSelectLabel', '12+0')
        shouldHaveText('div.CustomDatePickerTrigger > span', '2022')
        shouldHaveText('li.PaneList__Item.active > div', 'Транспорт')
        cy.get(':nth-child(1) > .GbarHorizontal__Box > .GbarHorizontal__Percent > .GbarHorizontal__Percent_Box > :nth-child(11) > .GbarHorizontal__Units_Value').then((el) => {
            let txt = el.text()
            for (let i = 2; i <= 4; i++) {
                shouldHaveText(`:nth-child(${i}) > .GbarHorizontal__Box > .GbarHorizontal__Percent > .GbarHorizontal__Percent_Box > :nth-child(11) > .GbarHorizontal__Units_Value`, txt)
            }
        })
        // cy.get(':nth-child(1) > .GbarHorizontal__Box > .GbarHorizontal__Percent > .GbarHorizontal__Percent_Box > :nth-child(11) > .GbarHorizontal__Units_Value')
        // cy.get(':nth-child(2) > .GbarHorizontal__Box > .GbarHorizontal__Percent > .GbarHorizontal__Percent_Box > :nth-child(11) > .GbarHorizontal__Units_Value')
        // cy.get(':nth-child(4) > .GbarHorizontal__Box > .GbarHorizontal__Percent > .GbarHorizontal__Percent_Box > :nth-child(11) > .GbarHorizontal__Units_Value')
    })




})