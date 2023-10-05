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

export function shouldContainText(selector, text) {
    cy.get(selector, {timeout: 8000}).should('contain.text', text)
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
        shouldContainText('div.Header div', el)
    })
}

export function searchArticleInHeader(name) {
    // Не используется    
    Cypress.env('articles').forEach(el => {
        clickAnElement(name)
        shouldContainText('div.GradientVizel__Title', el)
    })
}

export function switchLeftPaneElements(headerName, list) {
    //проверка на активность элемента (?)
    list.forEach(el => {
        clickAnElement(el)
        shouldContainText(headerName, el)
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
    shouldContainText('div.GradientVizel__Title', txt)
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


export function isAndIsnt(el1, el2) {
    waitForElement(el1)
    waitForElementIsAbsent(el2)
}


export function textInSeveralElements(text, elements) {
    cy.document().then((doc) => {                                             // У всех диаграмм внизу выводится первым по порядку
        let theseAll = doc.querySelectorAll(elements)
        theseAll.forEach((thisOne) => {
            shouldContainText(thisOne, text)
        })
    })
}


export function scrollDown() {
    cy.get('div.DsShellMain').scrollTo('bottom', {timeout: 20000})
}


export function scrollUp() {
    cy.get('div.DsShellMain').scrollTo('top', {timeout: 8000})
}


export function shouldBeInBreadcrumbs(text) {
    cy.get('li.GBreadcrumbs__Item')
    .last()
    .children('span')
    .should('contain.text', text)
}


export function otsenka_drilldown(crumb) {
    scrollDown()
    cy.wait(2000)
    cy.get(`span[title="${crumb}"]`).click()
    cy.wait(2000)
    shouldContainText('div.GradientVizel__Title', crumb)
    scrollUp()
    shouldBeInBreadcrumbs(crumb)
    
}


export function waitForResponse(alias, partialResponse, maxRequests, level = 0) {
    if (level === maxRequests) {
        throw `${maxRequests} requests exceeded`         // fail the test
    }
    cy.wait(alias).then(xhr => {
        cy.log(`Request number ${level+1}`)
        const isMatch = Cypress._.isMatch(xhr.response, partialResponse)
        if (!isMatch) {
            waitForResponse(alias, partialResponse, maxRequests, level+1)
        }
    })
}


export function waitForRequest(alias, partialRequest, maxRequests, level = 0) {
    if (level === maxRequests) {
        throw `${maxRequests} requests exceeded`         // fail the test
    }
    cy.wait(alias).then(xhr => {
        cy.log(`Request number ${level+1}`)
        const isMatch = Cypress._.isMatch(xhr.request, partialRequest)
        if (!isMatch) {
            waitForRequest(alias, partialRequest, maxRequests, level+1)
        }
    })
}


export function countChildren(elements, parent) {
    // считает, сколько элементов из списка elements являются прямыми потомками parent, а сколько не являются.
    // пока только для двух родителей; если будет больше - нужно будет переписывать
    let goodChildren, badChildren = 0
    elements.forEach((el) => {
        //if (cy.get(el).parents() === cy.get(parent)) {
        //let parentz = Array.from(cy.get(el).parents())
        //cy.log(parentz)
        if (cy.get(el).closest(parent)) {
            goodChildren++
        }
        else {
            badChildren++
        }
        
    })
    return [goodChildren, badChildren]
}