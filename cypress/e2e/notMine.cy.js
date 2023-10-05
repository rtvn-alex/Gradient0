/// <reference types="cypress" />


describe('testing junk', () => {


    it('is just a test', () => {
        var today = new Date();
 
// получить сегодняшнюю дату в формате `MM/DD/YYYY`
        var now = today.toLocaleDateString('en-US');
        cy.log(now);
    })
})