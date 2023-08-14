/// <reference types="cypress" />


import {
    navigate,
    auth,
    clickAnElement,
    enterGradient
} from "../../page-objects/functions.js"


describe('actions', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient()
        clickAnElement('Оценка')
    })


    it('should check the page and elements', () => {
        cy.get('article.GradientVizel:nth-of-type(2)').should('exist')                                          //загружаются 2 графика
        cy.get('span.Tag:nth-of-type(7)').should('exist')                                                       //загружаются 7 активов
        cy.get(('div.MainPane__SwitchViewButtons>button.AppButton.active')).should('have.text', 'График')       //Переключатель в востоянии "График"
        cy.get('button.AppButton_Size_Sm.active').should('have.text', 'Без нормализации')                       //Переключатель в востоянии "Без нормализации"
        cy.contains('руб./тн').should('exist')                                                                  //Установлен размерность 'руб./тн'
    })


})