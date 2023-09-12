/// <reference types="cypress" />


//import { should } from "chai"
import {
    navigate,
    auth,
    clickAnElement,
    enterGradient,
    parseToJSON,
    checkNormalisation,
    waitForElement,
    waitForElementIsAbsent,
    zoomInAndOut,
    isAndIsnt,
    switchLeftPaneElements,
    shouldContainText,
    textInSeveralElements,
    shouldBeInBreadcrumbs,
    otsenka_drilldown,
    scrollDown,
    scrollUp,
    waitForRequest
} from "../../page-objects/functions.js"


describe('actions', () => {
    beforeEach(() => {
        navigate()
        auth()
        enterGradient()
        clickAnElement('Оценка')
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/koob/data?elPotencial').as('elPotencial') 
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_3/data?el').as('dataEl')
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_3/data?el').as('dataEl1')
        /*cy.intercept({
            path: '/data?el',
            query: {
                filter: '+(5, 1, 2)+'
            }
        }).as('dataEl')*/
    })


    it('should check the page and elements', () => {
        waitForElement('article.GradientVizel:nth-of-type(2)')                                          //загружаются 2 графика
        waitForElement('span.Tag:nth-of-type(7)')                                                       //загружаются 7 активов
        cy.get(('div.MainPane__SwitchViewButtons>button.AppButton.active')).should('have.text', 'График')       //Переключатель в востоянии "График"
        cy.get('button.AppButton_Size_Sm.active').should('have.text', 'Без нормализации')                       //Переключатель в востоянии "Без нормализации"
        cy.contains('руб./тн').should('exist')                                                                  //Установлена размерность 'руб./тн'
    })


    it.skip('should check "plan+fact" switchers', () => {
        // НЕ РАБОТАЕТ - либо починить, либо удалить
        //cy.wait('@elPotencial')
        
        cy.get('button.PeriodsSelector__Button:nth-of-type(4)').click()
        .then(cy.wait('@elPotencial')
        .then((xhr) => {
            expect(xhr.request.body.filters.mnt_period[1]).to.be.eq("9+3")
            expect(parseToJSON(xhr)[0]).to.have.property('mnt_period', "9+3")
        }))
    })


    it.skip('should correctly check "plan+fact" switchers', async () => {
        // НЕ РАБОТАЕТ - либо починить, либо удалить
        // ASYNC и AWAIT мб тоже лишние

        await cy.wait('@elPotencial', {timeout:10000})
        await cy.wait('@elPotencial', {timeout:10000})
        await cy.wait(5000)
        //debugger
        await cy.get('div.GradientVizel__Potencial_Chart_GBar_Value', {timeout:10000}).should('be.visible')
        await cy.get('button.PeriodsSelector__Button:nth-of-type(4)').click()
        await cy.wait(5000)
        //debugger
        await cy.wait('@elPotencial2')
        .then((xhr) => {
            expect(xhr.request.body.filters.mnt_period[1]).to.be.eq("9+3")
            expect(parseToJSON(xhr)[0]).to.have.property('mnt_period', "9+3")
        })
    })


    it('should check changing of names after switching "plan+fact"', () => {
        cy.get('button.PeriodsSelector__Button:nth-of-type(4)').click()
        cy.get('button.PeriodsSelector__Button.active').should('have.text', '9+3')
        shouldContainText('.GradientVizel__Potencial_Title', '9+3')
        shouldContainText('.GradientVizel__Title', '9+3')
    })


    it('should check changing of names after choosing a period from the list', () => {
        cy.get('button.last').click()
        cy.get('li.MainPane__PeriodsSelectItem:nth-of-type(5):last').click() 
        waitForElementIsAbsent('button.PeriodsSelector__Button.active')
        shouldContainText('.GradientVizel__Potencial_Title', '4+8')
        shouldContainText('.GradientVizel__Title', '4+8')
    })


    it('should change the year', () => {
        cy.get('div.CustomDatePickerTrigger').click()
        clickAnElement('2021')
        // cy.get('.GradientVizel__Potencial_Title').should('contain.text', '2021')          УТОЧНИТЬ!!!
        shouldContainText('.GradientVizel__Title', '2021')
        waitForElementIsAbsent('div.react-datepicker__year--container')
    })


    it('should delete an active correctly', () => {
        scrollDown()
        cy.contains('div.GBarChart__XAxisTitle', Cypress.env('someAct')).should('exist')
        scrollUp()
        cy.contains('span', Cypress.env('someAct')).siblings('i').click()
        cy.contains(Cypress.env('someAct')).should('not.be.visible')
    })


    it('should check deleting of actives from the list', () => {
        clickAnElement('Активы')
        waitForElement('div.ds_3.open')
        clickAnElement('Очистить все')
        Cypress.env('activesWithoutYamal').forEach((act) => {
            cy.contains('label.AppCheckbox', act).children('span.AppCheckbox__checkmark').should('not.be.checked')
        })
        clickAnElement('Применить')
        cy.wait(1000)
        waitForElementIsAbsent('span.Tag:nth-of-type(2)')
        Cypress.env('activesWithoutYamal').forEach((act) => {
            cy.contains(act).should('not.be.visible')
        })
    })


    it.skip('should check adding of actives to the list', () => {
        
        // Не работает, карточка в Wekan https://wekan.spb.luxms.com/b/JwBS9R9iSvJcGEzeK/gradient/9frqNNfLZJTebWyj9

        clickAnElement('Активы')
        cy.contains('label.AppCheckbox', Cypress.env('someAct')).siblings('i').children('svg').click()
        //cy.contains('Зимнее').children('span').click()
       // cy.log(cy.get('ul.AppTree__ChildList:nth-child(-n + 3)').map('innerText'))
        /*for (let i of cy.get('ul.AppTree__ChildList:nth-of-child(-n + 3)').map('innerText')){
            cy.get('i span').check()
        }*/
        
        for (let i of Cypress.env('digits').slice(0, 3)){
            cy.get('ul.AppTree__ChildList>:nth-child(' + `${i}` +') span').click()
        }
        /*
        cy.get('ul.AppTree__ChildList>:nth-child(1) span').click() */
        cy.get('ul.AppTree__ChildList>:nth-child(4) span').should('not.be.enabled')
    })


    it('should check the search', () => {
        let way = 'ul.AppTree__ChildList>li.AppTree__Item:not(.hidden)'
        let searchStrings = [
            "Южно-",
            "Вское",
            "восточ",
            // " + "                эти кейсы пока падают, но вообще-то не должны - 
            // " (ВУ"               нужно включить, когда (и если) починят; ссылка на Wekan https://clck.ru/35PTNu
        ]
        cy.wait(5000)
        clickAnElement('Активы')
        for (let el of searchStrings){
            cy.get('input[type="search"]').click().type(el)
            cy.wait(1500)
            cy.get(way).each((child) => {
                cy.wrap(child).contains(el, {matchCase: false}).should('exist')
            })
            cy.get('input[type="search"]').clear()
        }
    })


    it('should check the normalisation switcher', () => {
        let namesList = ['С нормализацией', 'Без нормализации']
        checkNormalisation(namesList[0])
        cy.get('.norm .GBarChart__Bar').should('have.css', 'background').should('contain', 'rgb(24, 175, 112)')
        checkNormalisation(namesList[1])
        cy.get('div.GBarChart__Bar').should('have.css', 'background').should('contain', 'rgb(36, 175, 190)')
    })


    it('should check enlarging and diminishing', () => {
        cy.get('div.DsShellMain').scrollTo('bottom', {timeout: 8000})
        cy.get('span.GBar__Title__Menu').first().click()
        zoomInAndOut('ul.GBarMenu>li:first-of-type')
        zoomInAndOut('div#zoomIn')       
    })


    it('should check for diminishing of the diagrams from the default position and enlarging them back', () => {
        let normal = 'ul.Normal', little = 'ul.Little'
        isAndIsnt(normal, little)
        cy.get('div#zoomOut').click()
        isAndIsnt(little, normal)
        cy.get('div#zoomIn').click()
        isAndIsnt(normal, little)
    })


    it('should check metrics comparing interface', () => {
        let popUp = 'div.OpenModalContainer__Content'
        scrollDown()
        cy.get('span.GBar__Title__Menu').first().click()
        clickAnElement('Сравнение по метрикам')
        waitForElement(popUp)
        cy.wait(2000)
        cy.get('i.GradientVizel__ModalClose').trigger('click')         //cy.get('path[fill-rule="evenodd"]').first().click
        waitForElementIsAbsent(popUp)
    })


    it('should check appearing of pop-up above the columns', () => {
        
        scrollDown()
        cy.wait(3000)
        cy.document().then((doc) => {
            let columns = doc.querySelectorAll('div.GBarChart__XAxisBlock')
            columns.forEach((column) => {
                cy.get(column)
                .should('have.attr', 'aria-expanded', 'false')
                .trigger('mouseenter').wait(200)
                .should('have.attr', 'aria-expanded', 'true')
                .trigger('mouseleave', 'bottom').wait(200)
                .should('have.attr', 'aria-expanded', 'false')
            })
        })
        
    })


    it('should switch the processes and articles', () => {
        switchLeftPaneElements('li.GBreadcrumbs__Item > span', Cypress.env('articles'))
        switchLeftPaneElements('li.GBreadcrumbs__Item > span', Cypress.env('processes'))
    })


    it('should check changing of actives and subactives', () => {
        const act = Cypress.env('someAct')
        const subact = 'Южное'
        cy.wait(3000)
        clickAnElement('Ямал')
        clickAnElement(act)
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/koob/data?elPotencial').as('elPotencial2')
        cy.wait('@elPotencial2').then((xhr) => {
            expect(xhr.request.body.filters.do_code[1]).to.be.eq(4)                // Проверка запроса и ответа для act 
            expect(parseToJSON(xhr)[0]).to.have.property('do_name', act)
        })

        cy.get('span.Tag')                                                         // Первый в списке активов и без крестика
        .first()
        .children()
        .should('contain.text', act)
        .nextAll()
        .should('not.exist')

        shouldContainText('div.GradientVizel__Potencial_Title', act)              // Выводится в заголовке
        scrollDown()
        cy.wait(100)
        textInSeveralElements(act, 'div.first>.GBarChart__XAxisTitle')            // Первый по порядку во всех нижних диаграммах

        clickAnElement('Не выбрано')
        clickAnElement(subact)
        cy.get('span.Tag')
        .first()
        .children()
        .should('contain.text', subact)
        .nextAll()
        .should('not.exist')

        scrollDown()              // Первый по порядку во всех нижних диаграммах
        cy.wait(100)
        textInSeveralElements(subact, 'div.first>.GBarChart__XAxisTitle')
    })


    it.only('should check the navigation by both ways', () => {
        const crumbs = [
            'Транспорт',
            'Транспортные услуги',
            'Грузовой транспорт',
            'Самосвал (включая автопоезд)',
            'Грузоподъемность 20.1 - 40 т'
        ]
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/ds_brd_gradient_3/data?el').as('dataEl2')
        /*const header = 'div.GradientVizel__Title'

        clickAnElement(crumbs[1])
        cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/koob/data?elPotencial').as('elPotencial2')
        cy.wait('@elPotencial2').then((xhr) => {
            expect(xhr.request.body.filters.cost_sub_categories_id[1]).to.be.eq(112)                // Проверка запроса и ответа 
        })
        shouldContainText(header, crumbs[1])
        shouldBeInBreadcrumbs(crumbs[1])

        cy.contains(crumbs[2]).trigger('mouseenter')
        clickAnElement('Подробнее')
        //cy.intercept('https://dev-gradient.luxmsbi.com/api/v3/koob/data?elPotencial').as('elPotencial2')
        cy.wait('@elPotencial2').then((xhr) => {
            expect(xhr.request.body.filters.class_code1[1]).to.be.eq(2)                // Проверка запроса и ответа
        })
        shouldContainText(header, crumbs[2])
        shouldBeInBreadcrumbs(crumbs[2])
        */
/*
        scrollDown()
        cy.wait(2000)
        cy.get('span.GBar__Title__Title').first().click()
        cy.wait(2000)
        scrollUp()
        shouldBeInBreadcrumbs(crumbs[1])
        */

        otsenka_drilldown(crumbs[1])
        waitForRequest('@dataEl2', {body: {filters: {cost_sub_categories_id: ["=", 112]}}}, 10)
        cy.get('@dataEl2')
        .its('request.body.filters.cost_sub_categories_id[1]').should('to.be.eq', 112)

        otsenka_drilldown(crumbs[2])
        cy.wait('@dataEl2').then((xhr) => {
            expect(xhr.request.body.filters.class_code1[1]).to.be.eq(2)                // Проверка запроса и ответа 
        })

        otsenka_drilldown(crumbs[3])
        cy.wait('@dataEl2').then((xhr) => {
            expect(xhr.request.body.filters.class_code3[1]).to.be.eq(20110)                // Проверка запроса и ответа 
        })
        /*
        cy.wait('@dataEl2')
        cy.wait('@dataEl2')
        cy.wait('@dataEl2')
        cy.wait('@dataEl2').then((xhr) => {
            expect(xhr.request.body.filters.cost_sub_categories_id[1]).to.be.eq(112)                // Проверка запроса и ответа 
        })
        */
/*
ХЗ, МОЖЕТ, НЕ НАДО ПОСЛЕ ПЕРВОГО РАЗА
        otsenka_drilldown(crumbs[2])
        cy.wait(3000)
        waitForRequest('@dataEl2', {body: {filters: {class_code1: ["=", 2]}}}, 10)
        cy.get('@dataEl2')
        .its('request.body.filters.class_code1[1]').should('to.be.eq', 2)
*/
        /*
        otsenka_drilldown(crumbs[3])
        cy.wait('@elPotencial2').then((xhr) => {
            expect(xhr.request.body.filters.class_code3[1]).to.be.eq(20102)                // Проверка запроса и ответа 
        })
*/
        otsenka_drilldown(crumbs[4])
        waitForElementIsAbsent('ul.GradientVizel__Charts')

        cy.get('li.GBreadcrumbs__Item').first().click()
        clickAnElement('График')
        scrollDown()
        waitForElement('ul.GradientVizel__Charts')
        
        for (let i = 1; i <= 4; i++) {
            cy.contains(crumbs[i]).trigger('mouseenter')
            clickAnElement('Подробнее')
        }
        waitForElementIsAbsent('ul.GradientVizel__Charts')
    })


})
