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
    clickAnElement('Lifting cost')
}

export function waitForElement(el){
    cy.get(el, {timeout: 10000}).should('exist')
}

export function showElement(el){
    cy.get(el, {timeout: 10000}).should('be.visible')
}