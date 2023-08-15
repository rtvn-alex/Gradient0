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
        cy.wait('@elPotencial')
        .then(cy.get('button.PeriodsSelector__Button:nth-of-type(4)').click()
        .then(cy.wait('@elPotencial')
        .then((xhr) => {
                    expect(xhr.request.body.filters.mnt_period[1]).to.be.eq("9+3")
                    expect(parseToJSON(xhr)[0]).to.have.property('mnt_period', "9+3")
        })))
    })


    it.skip('should correctly check "plan+fact" switchers', () => {
        // НЕ РАБОТАЕТ - либо починить, либо удалить

        //cy.wait('@elPotencial', {timeout:10000})
        //cy.wait('@elPotencial', {timeout:10000})
        cy.get('button.PeriodsSelector__Button:nth-of-type(4)').click()
        cy.wait(5000)
        cy.wait('@elPotencial', {timeout:10000}).then((xhr) => {
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


    it.only('should delete an active correctly', () => {
        cy.contains('div.GBarChart__XAxisTitle', 'Хантос').should('be.visible')
        cy.contains('span', 'Хантос').siblings('i').click()
       // cy.wait(3000)
        cy.contains('Хантос').should('not.be.visible')
    })

})
