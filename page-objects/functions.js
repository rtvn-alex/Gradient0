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

export function enterGradient() {
    clickAnElement('Визуализации')
    clickAnElement('LС Нефть')
}

export function waitForElement(el) {
    cy.get(el, {timeout: 10000}).should('exist')
}

export function waitForElementIsAbsent(el) {
    cy.get(el).should('not.exist')
}

export function showElement(el) {
    cy.get(el, {timeout: 10000}).should('be.visible')
}

export function searchProcessInHeader(name) {
    // Не используется
    Cypress.env('processes').forEach(el => {
        clickAnElement(name)
        cy.get('div.Header div', ).should('contain.text', el)
    })
}

export function searchArticleInHeader(name) {
    // Не используется    
    Cypress.env('articles').forEach(el => {
        clickAnElement(name)
        cy.get('div.GradientVizel__Title', {timeout: 6000}).should('contain.text', el)
    })
}

export function switchLeftPaneElements(headerName, list) {
    //проверка на активность элемента (?)
    list.forEach(el => {
        clickAnElement(el)
        cy.get(headerName).should('contain.text', el)
    })
}

export function parseToJSON(xhr) {
    // парсинг stream+json в json
    let data = xhr.response.body
    if (String(xhr.response.headers['content-type']).startsWith('application/stream+json')) {
        if (typeof data === 'string') {
            data = data.split('\n').filter((line) => !!line).map((line) => JSON.parse(line));
        } else if (data && (typeof data === 'object') && !Array.isArray(data)) {
            data = [data];
        }
    }
    return data
}

export function checkNormalisation(txt) {
    clickAnElement(txt)
    //cy.get('.GradientVizel__Potencial_Title').should('contain.text', txt)
    cy.get('div.GradientVizel__Title').should('contain.text', txt)
}


export function zoomInAndOut(selector) {
    let vizelOnly = 'li.GradientVizel__Chart:only-of-type'
    cy.get(selector).click()
    waitForElement(vizelOnly)
    cy.wait(500)
    cy.get('div#zoomIn').should('have.class', 'disabled')
    cy.wait(500)
    cy.get('div#zoomOut').click()
    waitForElementIsAbsent(vizelOnly)
}

