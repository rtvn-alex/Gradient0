/// <reference types="cypress" />


import {
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    parseToJSON
} from "../../page-objects/functions.js"


describe('actions', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient()
        clickAnElement('Оценка')
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/koob/data?elPotencial').as('elPotencial')
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/koob/data?elPotencial').as('elPotencial1')
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/koob/data?elPotencial').as('elPotencial2')
    })


    it('should check the page and elements', () => {
        cy.get('article.GradientVizel:nth-of-type(2)').should('exist')                                          //загружаются 2 графика
        cy.get('span.Tag:nth-of-type(7)').should('exist')                                                       //загружаются 7 активов
        cy.get(('div.MainPane__SwitchViewButtons>button.AppButton.active')).should('have.text', 'График')       //Переключатель в востоянии "График"
        cy.get('button.AppButton_Size_Sm.active').should('have.text', 'Без нормализации')                       //Переключатель в востоянии "Без нормализации"
        cy.contains('руб./тн').should('exist')                                                                  //Установлен размерность 'руб./тн'
    })


    it.skip('should check "plan+fact" switchers', () => {
        // НЕ РАБОТАЕТ - либо починить, либо удалить
        //cy.wait('@elPotencial')
        
        cy.get('button.PeriodsSelector__Button:nth-of-type(4)').click()
        .then(cy.wait('@elPotencial')
        .then((xhr) => {
            expect(xhr.request.body.filters.mnt_period[1]).to.be.eq("9+3")
            expect(parseToJSON(xhr)[0]).to.have.property('mnt_period', "9+3")
        }))
    })


    it.skip('should correctly check "plan+fact" switchers', async () => {
        // НЕ РАБОТАЕТ - либо починить, либо удалить
        // ASYNC и AWAIT мб тоже лишние

        await cy.wait('@elPotencial', {timeout:10000})
        await cy.wait('@elPotencial', {timeout:10000})
        await cy.wait(5000)
        //debugger
        await cy.get('div.GradientVizel__Potencial_Chart_GBar_Value', {timeout:10000}).should('be.visible')
        await cy.get('button.PeriodsSelector__Button:nth-of-type(4)').click()
        await cy.wait(5000)
        //debugger
        await cy.wait('@elPotencial2')
        .then((xhr) => {
            expect(xhr.request.body.filters.mnt_period[1]).to.be.eq("9+3")
            expect(parseToJSON(xhr)[0]).to.have.property('mnt_period', "9+3")
        })
    })


    it('should check changing of names after switching "plan+fact"', () => {
        cy.get('button.PeriodsSelector__Button:nth-of-type(4)').click()
        cy.get('button.PeriodsSelector__Button.active').should('have.text', '9+3')
        cy.get('.GradientVizel__Potencial_Title').should('contain.text', '9+3')
        cy.get('.GradientVizel__Title').should('contain.text', '9+3')
    })


    it('should check changing of names after choosing a period from the list', () => {
        cy.get('button.last').click()
        cy.get('li.MainPane__PeriodsSelectItem:nth-of-type(5):last').click() 
        cy.get('button.PeriodsSelector__Button.active').should('not.exist')
        cy.get('.GradientVizel__Potencial_Title').should('contain.text', '4+8')
        cy.get('.GradientVizel__Title').should('contain.text', '4+8')
    })


    it('should change the year', () => {
        cy.get('div.CustomDatePickerTrigger').click()
        clickAnElement('2021')
        cy.get('.GradientVizel__Potencial_Title').should('contain.text', '2021')
        cy.get('.GradientVizel__Title').should('contain.text', '2021')
        cy.get('div.react-datepicker__year--container').should('not.exist')
    })


    it('should delete an active correctly', () => {
        cy.get('div.DsShellMain').scrollTo('bottom')
        cy.contains('div.GBarChart__XAxisTitle', Cypress.env('someAct')).should('exist')
        cy.get('div.DsShellMain').scrollTo('top')
        cy.contains('span', Cypress.env('someAct')).siblings('i').click()
        cy.contains(Cypress.env('someAct')).should('not.be.visible')
    })


    it('should check deleting of actives from the list', () => {
        clickAnElement('Активы')
        cy.get('div.ds_3.open').should('exist')
        clickAnElement('Очистить все')
        Cypress.env('activesWithoutYamal').forEach((act) => {
            cy.contains('label.AppCheckbox', act).children('span.AppCheckbox__checkmark').should('not.be.checked')
        })
        clickAnElement('Применить')
        cy.wait(1000)
        cy.get('span.Tag:nth-of-type(2)').should('not.exist')
        Cypress.env('activesWithoutYamal').forEach((act) => {
            cy.contains(act).should('not.be.visible')
        })
    })


    it.only('should check adding of actives to the list', () => {
        
        // РАЗОБРАТЬСЯ!!!

        clickAnElement('Активы')
        cy.contains('label.AppCheckbox', Cypress.env('someAct')).siblings('i').children('svg').click()
        cy.contains('Зимнее').children('span').click()
       // cy.log(cy.get('ul.AppTree__ChildList:nth-child(-n + 3)').map('innerText'))
        /*for (let i of cy.get('ul.AppTree__ChildList:nth-of-child(-n + 3)').map('innerText')){
            cy.get('i span').check()
        }*/
        for (let i of Cypress.env('digits').slice(0, 2)){
            cy.get('ul.AppTree__ChildList :nth-child(' + `${i}` +') span').click()
        }
        cy.get('ul.AppTree__ChildList :nth-child(4) span').should('be.disabled')
    })
})
