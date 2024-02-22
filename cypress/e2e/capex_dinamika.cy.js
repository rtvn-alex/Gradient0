/// <reference types="cypress" />


import {
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    shouldHaveText,
    shouldContainText,
    showElement, 
    waitForElement,
    waitForElementIsAbsent,
    parseToJSON,
    isAndIsnt,
    waitForRequest,
    takeProperty
} from "../../page-objects/functions.js"


describe('actions', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient(Cypress.env('capexSkv'))
        clickAnElement('Динамика')
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_13/data?loadDataCapex').as('loadDataCapex')
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_9/data?elDynamic').as('elDynamic')
    })


    it('should check the page and elements', () => {
        cy.get('section.LineChart', {timeout:10000})    //есть только у графика и только в режиме "Значения" 
        shouldContainText('li.LineChart__Title', 'кв')
        shouldContainText('li.GBarChartWithTabs__Tab.active', 'ПЦСС')
        shouldHaveText(' label.ChoiceGroup-Label_checked > span', 'Корпоративный')
    })


    it('should check the "graph-table" switcher', () => {                         // БАГИ???
        clickAnElement('Таблица')
        showElement('table.GradientTable__Table')
        waitForElementIsAbsent('li.GradientVizel__Chart')
        clickAnElement('График')
        showElement('li.GradientVizel__Chart')
        waitForElementIsAbsent('table.GradientTable__Table')
    })


    it('should check the "data-ratings" switcher', () => {
        cy.get('.SwitchButtons:first-of-type > :last-child').click()
        isAndIsnt('section.RankedChart', 'section.LineChart')
        cy.get('.SwitchButtons:first-of-type > :first-child').click()
        isAndIsnt('section.LineChart', 'section.RankedChart')
    })


    it.skip('should check the "quarters-years" switcher', () => {
        cy.get('.SwitchButtons:last-of-type > :last-child').click()
        cy.contains(' кв. ').should('not.exist')                                     // НЕ РАБОТАЕТ, БАГ
        cy.get('.SwitchButtons:last-of-type > :first-child').click()
        cy.contains(' кв. ').should('exist')
    })


    it('should check lines width changes after changing of actives and subactives', () => {                                  // ПОДАКТИВЫ НЕ МЕНЯЮТСЯ
        cy.get('div.LineChart__Lines line[stroke="rgb(100, 108, 223)"]').should('have.attr', 'stroke-width').and('equal', '3px')
        clickAnElement(Cypress.env('defaultAct'))
        clickAnElement(Cypress.env('someAct'))
        cy.get('div.LineChart__Lines line[stroke="rgb(100, 108, 223)"]').should('have.attr', 'stroke-width').and('equal', '7px')
    })


    it('should check changing of actives in ratings mode', () => {
        cy.get('.SwitchButtons:first-of-type > :last-child', {timeout: 8000}).click()
        shouldContainText('.active>span.RankedChart__Label__title', Cypress.env('defaultAct'))
        clickAnElement(Cypress.env('defaultAct'))
        clickAnElement(Cypress.env('someAct'))
        shouldContainText('.active>span.RankedChart__Label__title', Cypress.env('someAct'))
    })


    it('should check changing of PTsSS & Q', () => {
        let title1 = 'Удельный Q'
        let title2 = 'Срок ПЦСС'
        let coob1 = 'gradient.capex_id_4_udelnyj_q_lvl_1_line_chart'
        let coob2 = 'gradient.capex_id_2_srok_pcss_lvl_1_line_chart'
        //cy.wait('@loadDataCapex')
        //cy.wait('@loadDataCapex')

        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_13/data?loadDataCapex').as('loadDataCapex')
        clickAnElement(title1)
        //cy.wait(2000)
        waitForRequest('@loadDataCapex', {body: {with: coob1}}, 10)
        cy.get('@loadDataCapex').its('request.body.with').should('be.eq', coob1)
        cy.get('@loadDataCapex').then((xhr) => {
            expect(parseToJSON(xhr)[0]).to.have.property('title', title1)
        })

        clickAnElement(title2)
        //cy.wait(2000)
        waitForRequest('@loadDataCapex', {body: {with: coob2}}, 10)
        cy.get('@loadDataCapex').its('request.body.with').should('be.eq', coob2)
        cy.get('@loadDataCapex').then((xhr) => {
            expect(parseToJSON(xhr)[0]).to.have.property('title', title2)
        })
    })


    it('should check "flexible-corporate" switcher', () => {
        let flex = 'div.SliderLine-Line'
        let corp = '.GradientVizel__Scatter_Box_Container button.GradientVizel__Scatter_Box_Btn'
        isAndIsnt(corp, flex)
        clickAnElement('Гибкий')
        isAndIsnt(flex, corp)
        clickAnElement('Корпоративный')
        isAndIsnt(corp, flex)
    })


    it('should check wells switchers', () => {
        cy.get('button.GradientVizel__Scatter_Box_Btn').first().click()
        waitForElementIsAbsent('button.GradientVizel__Scatter_Box_Btn_Active')
        cy.wait(3000)
        cy.document().then((doc) => {
            let buttons = doc.querySelectorAll('button.GradientVizel__Scatter_Box_Btn:not(.GradientVizel__Scatter_Box_Disabled>.GradientVizel__Scatter_Box_Btn)')
            for (let i = 1; i <= buttons.length - 1; i++) {
                cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_13/data?loadDataCapex').as('loadDataCapex')
                cy.get(buttons).eq(i).click()
                cy.wait(1000)                            //ЭТУ ЗАДЕРЖКУ МОЖНО УВЕЛИЧИВАТЬ; НАДО ПРОВЕРИТЬ, КАКАЯ МИНИМАЛЬНАЯ ВОЗМОЖНА БЕЗ ФЕЙЛОВ
                cy.wait('@loadDataCapex').its('request.body.filters.skvazhiny_corp_code').should('have.length', i + 1)
            }
        })
    })


    it('should check all wells types switcher', () => {
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_13/data?loadDataCapex').as('loadDataCapex')
        cy.wait(3000)
        clickAnElement('Гибкий')
       //cy.wait(3000)
        cy.get('input.Switch-Input').click()
        
        
        cy.wait(1000)
        //waitForRequest('@loadDataCapex', {body: {filters: {tip_skvazhiny: A}}}, 10)
        //cy.get('@loadDataCapex').its('request.body.filters.tip_skvazhiny').should('have.length', 4)     
        cy.get('div.ChoiceGroup').last().children('label.ChoiceGroup-Label:not(.ChoiceGroup-Label_checked)').should('not.exist')
        waitForElementIsAbsent('div.Slider')
        cy.get('input.Switch-Input').click()
        /*cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_13/data?loadDataCapex').as('loadDataCapex')
        cy.get('@loadDataCapex').its('request.body.filters.tip_skvazhiny').should('have.length', 2)     
        */
        cy.get('div.ChoiceGroup').eq(1).children('label.ChoiceGroup-Label:not(.ChoiceGroup-Label_checked)').should('exist')
        waitForElement('div.Slider')
    })


    it('should check wells switcher in the flexible mode', () => {
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_13/data?loadDataCapex').as('loadDataCapex')
        cy.wait(3000)
        clickAnElement('Гибкий')
        cy.wait(3000)
        clickAnElement('ГС')       
        waitForRequest('@loadDataCapex', {body: {filters: {tip_skvazhiny: ["=", "ГС"]}}}, 10)
        cy.get('@loadDataCapex').its('request.body.filters.tip_skvazhiny[1]').should('eq', 'ГС')
    })


    it.skip('should check the top scroll', () => {                                                     // БАГ - НУЖНО ПРОВЕРИТЬ НА ОЦЕНКЕ ПОТЕНЦИАЛА, ТАМ РАБОТАЕТ
        cy.wait(3000)
        clickAnElement('Гибкий')
        cy.wait(3000)
        takeProperty('div.TextField:first-child input.TextField-Input', 'value')
        //cy.get('input.TextField-Input').first().should('have.attr', 'max')
        //cy.log(val)

        // cy.get('button[aria-label="0-button"]')
        //   .invoke('val', 3000)
        //   .trigger('input')
        // //takeProperty('div.TextField:first-child input.TextField-Input', 'value').and('not.eq', 0)
        // cy.wait(1500)
        // cy.get('input.TextField-Input').first().should('have.attr', 'value').and('be.not.eq', '0')

          /*.trigger('mousemove')
          .trigger('mouseDown')
          .trigger('mousemove
          ', {})
          */ 
         /*                                                // НЕМНОГО РАБОТАЕТ
        cy.get('button[aria-label="0-button"]')
          .trigger('mousedown')
        cy.get('div.SliderLine_view_default').trigger('mousemove')
        .trigger('mouseup', {force: true})
        */
    })


    it.only('should check the top inputs', () => {
        cy.wait(3000)
        clickAnElement('Гибкий')
        cy.wait(1000)
        takeProperty('div.TextField:first-child input.TextField-Input', 'value', 0)
        
    })


})