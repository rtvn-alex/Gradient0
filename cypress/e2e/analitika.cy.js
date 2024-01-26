/// <reference types="cypress" />

import { 
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    shouldHaveText,
    shouldContainText,
    waitForElement,
    waitForElementIsAbsent,
    switchLeftPaneElements,
    popupsCheck,
    isAndIsnt,
} from "../../page-objects/functions.js"


// пока не разобрался, как тут приходят данные, поэтому здесь тестируется только фронт


describe('basic tests', () => {
    beforeEach(() => {
        navigate()
        //cy.wait(3000)
        auth()
        //cy.wait(3000)
        enterGradient(Cypress.env('lcNeft'))
        //cy.wait(3000)
        clickAnElement('Аналитика')
        //cy.wait(5000)
    })              
    
    
    it('should check the page and elements', () => {
        cy.wait(5000)
        shouldHaveText('div.CustomDatePickerTrigger > span', '2022')
        shouldHaveText('.PeriodsSelector__Button.active', '12+0')
        shouldHaveText('.MainPane__SwitchViewBtn.active>span', 'График')
        shouldHaveText('.Buttons>.MainPane__SwitchViewBtn.active', 'Численное')
        cy.get('li.PaneList__Item.active>div').eq(0).should('have.text', 'Все процессы')                             //Установлено "Все процессы"
        cy.get('li.PaneList__Item.active>div').eq(1).should('have.text', 'Все статьи затрат')
    })


    it('should check changing of names after choosing a period from the list', () => {
        cy.get('button.last').click()
        cy.get('li.MainPane__PeriodsSelectItem:nth-of-type(5):last').click() 
        cy.wait(3000)
        waitForElementIsAbsent('button.PeriodsSelector__Button.active')
        shouldContainText('.GradientVizel__Title', '4+8')
    })


    it('should check changing of names after switching "plan+fact"', () => {
        cy.get('button.PeriodsSelector__Button:nth-of-type(4)').click()
        shouldHaveText('button.PeriodsSelector__Button.active', '9+3')
        shouldContainText('.GradientVizel__Title', '9+3')
    })


    it('should change the year', () => {
        cy.get('div.CustomDatePickerTrigger').click()
        cy.get('div.react-datepicker__year-text').eq(4).click()
        cy.wait(1500)       
        shouldContainText('.GradientVizel__Title', '2021')
        waitForElementIsAbsent('div.react-datepicker__year--container')
    })


    it('should switch the processes and articles', () => {
        switchLeftPaneElements('.Header > :nth-child(1)', Cypress.env('articles'))
        switchLeftPaneElements('.Header > :nth-child(1)', Cypress.env('processes'))
    })

    
    it('should check appearing of pop-up above the columns', () => {
        waitForElement('.GradientVizel__Chart .GBarChart__XAxisBlock')                                              // нужно для задержки
        cy.document().then((doc) => {       
            let columns = doc.querySelectorAll('.GradientVizel__Chart .GBarChart__XAxisBlock')
            let counter = 0
            columns.forEach((column) => {
                if (counter < 18) {
                    popupsCheck(column)
                    counter++
                }
            })
        })
    })


    it('should check "graph-table" switcher', () => {
        clickAnElement('Таблица')
        isAndIsnt('.GradientVizel .GradientTable__Content', '.GradientVizel .GradientVizel__Charts')
        clickAnElement('График')
        isAndIsnt('.GradientVizel .GradientVizel__Charts', '.GradientVizel .GradientTable__Content')
    })


    it('should check the "numbers-parts" switcher', () => {
        clickAnElement('В долях')
        isAndIsnt('.GBar__Body .Donut', '.GBar__Body .GBarChart__Main')
        clickAnElement('Численное')
        isAndIsnt('.GBar__Body .GBarChart__Main', '.GBar__Body .Donut')
    })


    it('should check enlarging and diminishing', () => {
        let names = Cypress.env('analitika_drilldown')
        cy.wait(3000)
        cy.get('span.GBar__Title__Menu').first().click()
        clickAnElement('Увеличить')
        waitForElement('ul.Big')

        for (let i = 0;  i < 5; i++) {
            cy.get('li.GBarChartWithTabs__Tab').eq(i).click()
            cy.get('li.GBarChartWithTabs__Tab.active').should('contain.text', names[i])
            cy.get('span.GBar__Title__Title').first().should('contain.text', names[i])
        }

        cy.get('div#zoomOut').first().click()
        waitForElement('ul.Normal')
        cy.get('div#zoomOut').first().click()
        waitForElement('ul.Little')
        cy.get('div#zoomIn').first().click()
        waitForElement('ul.Normal')

        for (let i = 0;  i < 3; i++) {
            cy.get('span.IconHeaderBox').eq(i).click()
            cy.get('div.GradientVizel__Header')
              .eq(i)
              .siblings()
              .should('have.attr', 'style').and('equal', 'display: none;')
        }
        for (let i = 0;  i < 3; i++) {
            cy.get('span.IconHeaderBox').eq(i).click()
            cy.get('div.GradientVizel__Header')
              .eq(i)
              .siblings()
              .should('have.attr', 'style').and('equal', 'display: inherit;')
        }
    })
})
