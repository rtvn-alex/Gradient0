/// <reference types="cypress" />


describe('testing junk', () => {
    it('tests getting text', () => {
        // cy.document().then((doc) => {
        //     let container = doc.getElementById('div.GradientVizel__Potencial_Title')
        //     cy.log(container.textContent())
        // })

        cy.get('.........').should(($div) => {    //или как ты там получаешь элемент
            let text = $div.text()
            // тут нужно делать все следующие шаги - потому что переменная локальная
            // и её можно использовать олько внутри этих фигурных скобок.
            expect(text).to.include('нужный текст') // собственно, проверка
        })
    })


    it('gets some dates before the current one', () => {
        var d = new Date()
        d.setDate(d.getDate() - 1)
        var day = d.toLocaleDateString()
        cy.log(day)                              // Выведет 9/26/2023

        var correctDate = day.replace(/\//g, '.')    // Замена слэша на точку
        cy.log(correctDate)                       //Выведет 9.26.2023
    })
})