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


export function shouldHaveText(selector, text) {
    cy.get(selector, {timeout: 8000}).should('have.text', text)
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


export function drillThatDown(crumb) {
    scrollDown()
    cy.wait(2000)
    cy.get(`span[title="${crumb}"]`).click()
    cy.wait(2000)
    shouldContainText('div.GradientVizel__Title', crumb)
    scrollUp()
    shouldBeInBreadcrumbs(crumb)
    
}


export function waitForResponse(alias, partialResponse, maxRequests, level = 0) {
    // ожидает запрос alias, в теле ответа которого содержится текст partialRequest
    // в течение maxRequests попыток
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
    // ожидает запрос alias, в теле запроса которого содержится текст partialRequest
    // в течение maxRequests попыток
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
        if (cy.get(el).closest(parent)) {
            goodChildren++
        }
        else {
            badChildren++
        }
        
    })
    return [goodChildren, badChildren]
}


export function popupsCheck(element) {
    // проверяет появление поп-апа при наведении крсора на element
    // и его отсутствие до и после наведения
    cy.get(element)
      .should('have.attr', 'aria-expanded', 'false')
      .trigger('mouseenter').wait(200)
      .should('have.attr', 'aria-expanded', 'true')
      .trigger('mouseleave', {force: true})
      .wait(50)
      .should('have.attr', 'aria-expanded', 'false')
}


export function backByBreadcrumbs(n) {
    const crumbs = Cypress.env('breadCrumbs')
    cy.get('li.GBreadcrumbs__Item').last().should('have.text', crumbs[n])
    for (let i = n; i > 0; i--) {
        cy.get('li.GBreadcrumbs__Item').eq(i-1).click()
        cy.get('li.GBreadcrumbs__Item').last().should('have.text', crumbs[i - 1])
    }
}


export function metricsCompairing(alias) {
    scrollDown()
    cy.get('span.GBar__Title__Menu').first().click()
    clickAnElement('Сравнение по метрикам')
    waitForElement('div.GradientVizel__Modal')
    shouldContainText('div.OpenModalContainer__Content div.GradientVizel__Title', 'Транспортные услуги')
    
    cy.get(alias).then((xhr) => {
        expect(xhr.request.body.filters.cost_sub_categories_id[1]).to.be.eq(112)                // Проверка запроса 
    })

    cy.get('i.GradientVizel__ModalClose').click()
    waitForElementIsAbsent('div.GradientVizel__Modal')
}


export function endingsCheck() {
    // проверяет, что у всех 4-х виджетов одинаковые числовые значения (в виде строк)
    cy.get(':nth-child(1) > .GbarHorizontal__Box > .GbarHorizontal__Percent > .GbarHorizontal__Percent_Box > :nth-child(11) > .GbarHorizontal__Units_Value').then((el) => {
        let txt = el.text()
        for (let i = 2; i <= 4; i++) {
            shouldHaveText(`:nth-child(${i}) > .GbarHorizontal__Box > .GbarHorizontal__Percent > .GbarHorizontal__Percent_Box > :nth-child(11) > .GbarHorizontal__Units_Value`, txt)
        }
    })
}


export function numberFromString(str) {
    const space = /\s/
    return +str.split(space)[0]
}


export function numberFromElementText(selector) {
    cy.get(selector).then((el) => {
        let num = +el.text().split(' ')[0]
        return num
    })
}
