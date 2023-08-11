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
}

export function waitForElement(el){
    cy.get(el, {timeout: 10000}).should('exist')
}

export function showElement(el){
    cy.get(el, {timeout: 10000}).should('be.visible')
}

export function searchProcessInHeader(name){
    // Не используется
    Cypress.env('processes').forEach(el => {
        clickAnElement(name)
        cy.get('div.Header div', ).should('contain.text', el)
    })
}

export function searchArticleInHeader(name){
    // Не используется    
    Cypress.env('articles').forEach(el => {
        clickAnElement(name)
        cy.get('div.GradientVizel__Title', {timeout: 6000}).should('contain.text', el)
    })
}

export function switchLeftPaneElements(headerName, list){
    //проверка на активность элемента (?)
    list.forEach(el => {
        clickAnElement(el)
        cy.get(headerName).should('contain.text', el)
    })
}
