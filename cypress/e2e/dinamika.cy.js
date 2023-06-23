/// <reference types="cypress" />

import {
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    showElement,
    waitForElement,
    searchProcessInHeader,
    searchArticleInHeader
} from "../../page-objects/functions.js"


describe('actions', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient()
        clickAnElement('Динамика')
    })


    it('should check the page and elements', () => {
        cy.get('section.LineChart', )    //есть только у графика и только в режиме "Значения" 
        cy.get('li.LineChart__Title').should('contain.text', 'кв')
        if (cy.contains('руб./тн').getAttribute('color') == 'rgb(0, 32, 51)') {
            cy.log('YESSSS')
        }
        else {
            cy.log('NOOOOOOPE')
        }
        
    })
})
