/// <reference types="cypress" />


import {
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    parseToJSON,
    waitForElement,
    waitForElementIsAbsent,
    shouldContainText
} from "../../page-objects/functions.js"


describe('actions', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient()
        clickAnElement('Динамика')
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_9/data?elDynamicChildren').as('elDynamicChildren')
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_9/data?elDynamic').as('elDynamic')
    })


    it('should check the page and elements', () => {
        cy.get('section.LineChart', {timeout:10000})    //есть только у графика и только в режиме "Значения" 
        shouldContainText('li.LineChart__Title', 'кв')
        cy.contains('руб./тн').should('exist')
    })


    it('should check for correct changes after changing the measure unit', () => {
        cy.wait('@elDynamicChildren')
        cy.get('div.MeasureSelect__Select span.AppSelect__TextField').click()
        clickAnElement('тыс.руб./скв.')
        cy.wait('@elDynamicChildren').then((xhr) => {
            expect(xhr.request.body.filters.unit_id[1]).to.be.eq(177)
            expect(parseToJSON(xhr)[0]).to.have.property('unit', "тыс.руб./скв.")
        })
    })


    it('should check the "graph-table" switcher', () => {
        clickAnElement('Таблица')
        cy.get('table.GradientTable__Table').should('exist').and('be.visible')
        waitForElementIsAbsent('li.GradientVizel__Chart')
        clickAnElement('График')
        cy.get('li.GradientVizel__Chart').should('exist').and('be.visible')
        waitForElementIsAbsent('table.GradientTable__Table')
    })


    it('should check the "data-ratings" switcher', () => {
        cy.get('.SwitchButtons:first-of-type > :last-child').click()
        cy.get('section.RankedChart').should('exist').and('be.visible')
        waitForElementIsAbsent('section.LineChart')
        cy.get('.SwitchButtons:first-of-type > :first-child').click()
        cy.get('section.LineChart').should('exist').and('be.visible')
        waitForElementIsAbsent('section.RankedChart')
    })


    it('should check the "quarters-years" switcher', () => {
        cy.get('.SwitchButtons:last-of-type > :last-child').click()
        cy.contains(' кв. ').should('not.exist')
        cy.get('.SwitchButtons:last-of-type > :first-child').click()
        cy.contains(' кв. ').should('exist')
    })
    
    
    it('should check lines width changes after changing of actives and subactives', () => {
        clickAnElement('Ямал')
        clickAnElement('СН-МНГ')
        cy.get('div.LineChart__Lines line[stroke="#108E9C"]').should('have.attr', 'stroke-width').and('equal', '7px')
    })


    it('should check changes after navigating the transport article', () => {
        cy.wait('@elDynamic')
        clickAnElement('Зимние дороги')
        cy.wait('@elDynamic').then((xhr) => {
            cy.log(xhr.request.body.filters.cost_sub_categories_id)
            expect(xhr.request.body.filters.cost_sub_categories_id[1]).to.be.eq("113")
            expect(parseToJSON(xhr)[0]).to.have.property('title', "Зимние дороги")
        })
    })


    /*
Здесь я пытался написать тест, в котором бы исследовалось изменение положения элементов графика при изменении размерности.
Но, т.к. значения нужно сохранять в переменных, всему мешают либо области видимости JS, либо асинхронность Cypress'а./
Было бы неплохо вернуться к этой проблеме позже, но сейчас есть ощущение, что на поиск решения ушло слишком много времени.
Решение может быть здесь: https://testersdock.com/cypress-chain-multiple-api/

    it('should expect the graph to be changed after changing the measure unit', () => {
        //let firstX, secondX, firstY, secondY
        let someVar = 'A'
        cy.log(cy.get('div.MeasureSelect__Select').invoke('attr', 'style').should('eq', 'width: 12.5rem; cursor: pointer;'))
        
        cy.get('div.MeasureSelect__Select').then($ele => {
            //var someVar
            if ($ele.attr('style') == 'width: 12.5rem; cursor: pointer;') {
                cy.log(someVar)
                cy.log($ele.attr('style'))
                cy.log('WOOOOOOOOOOORKS')
                someVar = $ele.attr('style')
                cy.log(someVar)
            }
        })     //.call(someVar)
        //cy.get('div.MeasureSelect__Select').should('have.attr', 'style')
        //cy.get('div.MeasureSelect__Select').invoke('attr', 'value').then(value => cy.log(value))
        //cy.log(cy.get('div.MeasureSelect__Select').its('style'))
        cy.log(someVar)
    })


    it('duplicates the previous method', () => {
        cy.log(cy.get('div.MeasureSelect__Select').invoke('attr', 'style').should('eq', 'width: 12.5rem; cursor: pointer;'))
        cy.get('.MeasureSelect > .AppSelect')
        let elName = 'A'
        //setTimeout(elName = document.querySelector('.MeasureSelect > .AppSelect'), 10000)
        setTimeout(() => {
            elName = document.querySelector('.MeasureSelect > .AppSelect')
            console.log(elName)
        }, 15000)
        //cy.log(elName)
        //const elName = document.querySelector('.MeasureSelect > .AppSelect')
        //let elName = setTimeout(document.querySelector, 5000, '.MeasureSelect > .AppSelect')
        setTimeout(() => {
            cy.log(cy.get('div.MeasureSelect__Select').invoke('attr', 'style').should('eq', 'width: 12.5rem; cursor: pointer;'))
            // cy.log(elName)
        }, 20000)
        // let valBefore = elName.getAttribute('style')  
    })

    it.only('should give us another chance', async () => {
        //let someVar = 'A'
        await cy.wait(5000)
        await cy.log(cy.get('div.MeasureSelect__Select').invoke('attr', 'style').should('eq', 'width: 12.5rem; cursor: pointer;'))
        // someVar = document.querySelector('.MeasureSelect > .AppSelect')
        const someVar = await cy.get('div.MeasureSelect__Select')
        .then($that => {
            return $that.invoke('attr', 'style')
        })
        await cy.log(someVar)
        console.log(someVar)
    })

    */
})
