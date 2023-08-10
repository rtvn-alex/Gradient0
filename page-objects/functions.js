/// <reference types="cypress" />

export function navigate() {
    cy.visit(Cypress.env('baseUrl'))
}

export function auth() {
    cy.get('input[autocomplete="username"]').type(Cypress.env('login'))
    cy.get('input[autocomplete="current-password"]').type(Cypress.env('password') + '{enter}')
}

export function clickAnElement(text) {
    cy.contains(text).click()
}

export function enterGradient(){
    clickAnElement('Визуализации')
    // clickAnElement('Динамика метрик')
}

export function waitForElement(el){
    cy.get(el, {timeout: 10000}).should('exist')
}

export function showElement(el){
    cy.get(el, {timeout: 10000}).should('be.visible')
}

export function searchProcessInHeader(name){
    clickAnElement(name)
    cy.get('div.Header div').should('contain.text', name)
}

export function searchArticleInHeader(name){
    clickAnElement(name)
    cy.get('div.GradientVizel__Title', {timeout: 6000}).should('contain.text', name)
    
    //cy.get('li.GBreadcrumbs__Item span').should('contain.text', name)        div.GradientVizel__Title     div.Header div:first-child
}

export function switchLeftPaneElements(headerName, list){
    //нужно будет дополнить проверкой на активность элемента
    for (el of list) {
        clickAnElement(el)
        cy.get(headerName).should('contain.text', 'el')
    }
}

//li.GBreadcrumbs__Item span