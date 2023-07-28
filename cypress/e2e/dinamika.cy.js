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
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_9/data?elDynamicChildren').as('elDynamicChildren')
    })


    it('should check the page and elements', () => {
        cy.get('section.LineChart', {timeout:10000})    //есть только у графика и только в режиме "Значения" 
        cy.get('li.LineChart__Title').should('contain.text', 'кв')
        cy.contains('руб./тн').should('exist')
    })


    it.only('should chech for coreect changes after changing the measure unit', () => {
        cy.wait('@elDynamicChildren')
        cy.get('div.MeasureSelect__Select span.AppSelect__TextField').click()
        cy.contains('тыс.руб./скв.').click()
        cy.wait('@elDynamicChildren').then((xhr) => {
            let data = xhr.response.body;

            if (String(xhr.response.headers['content-type']).startsWith('application/stream+json')) {
                if (typeof data === 'string') {
                    data = data.split('\n').filter((line) => !!line).map((line) => JSON.parse(line));
                } else if (data && (typeof data === 'object') && !Array.isArray(data)) {
                    data = [data];
                }
            }
            // cy.log(data)
        expect(xhr.request.body.filters.unit_id[1]).to.be.eq(177)
        expect(data[0]).to.have.property('unit', "тыс.руб./скв.")

        })
    })
})


/*
const response = await axios({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/stream+json',
      },
      data: body,
      cancelToken: request.cancelToken,
    });
    */