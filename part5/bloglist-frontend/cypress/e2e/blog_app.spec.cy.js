describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function(){
        cy.contains('login').click()
        cy.contains('username')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function(){
            cy.contains('login').click()
            cy.get('#username').type('mluukkai')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()

            cy.contains('Matti Luukkainen has successfully logged in')
        })

        it('fails with wrong credentials', function() {
            cy.contains('login').click()
            cy.get('#username').type('mluukkai')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()

            cy.contains('Wrong credentials')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'mluukkai', password: 'salainen' })
        })

        it('A blog can be created', function() {
            cy.contains('new blog').click()
            cy.get('#blog-title').type('Another blog cypress')
            cy.get('#blog-author').type('The Robots')
            cy.get('#blog-url').type('www.therobotsaretakingover.com')
            cy.contains('create').click()

            cy.contains('Another blog cypress')
        })

        describe('multiple blogs exist', function () {
            beforeEach(function(){
                cy.createBlog({ title: 'Blog one', author: 'John Doe', url: 'www.www.com' })
            })

            it('it can be liked', function (){
                cy.contains('Blog one').click()
                cy.contains('details').click()
                cy.contains('0')
                cy.get('#like-button').click()
                cy.contains('1')
            })

            it('it can be deleted', function() {
                cy.contains('Blog one')
                cy.contains('details').click()
                cy.get('#remove').click()

                cy.get('html').should('not.contain', 'Blog one')
            })
        })

        describe('and multiple blogs exist', function(){
            beforeEach(function(){
                cy.createBlog({ title: 'Blog one', author: 'John Doe', url: 'www.www.com' })
                cy.createBlog({ title: 'Blog two', author: 'John Doe', url: 'www.www.com' })
                cy.createBlog({ title: 'Blog three', author: 'John Doe', url: 'www.www.com' })

                cy.contains('Blog one').parent().parent().as('blog1')
                cy.contains('Blog two').parent().parent().as('blog2')
                cy.contains('Blog three').parent().parent().as('blog3')
            })

            it.only('they are ordered by likes', function() {
                cy.get('@blog1').contains('details').click()
                cy.get('@blog2').contains('details').click()
                cy.get('@blog3').contains('details').click()
                cy.get('@blog1').contains('like').as('like1')
                cy.get('@blog2').contains('like').as('like2')
                cy.get('@blog3').contains('like').as('like3')

                cy.get('@like1').click()
                cy.wait(500)
                cy.get('@like2').click()
                cy.wait(500)
                cy.get('@like2').click()
                cy.wait(500)
                cy.get('@like2').click()
                cy.wait(500)
                cy.get('@like3').click()
                cy.wait(500)
                cy.get('@like3').click()
                cy.wait(500)

                cy.get('.blog').eq(0).should('contain', 'Blog two')
                cy.get('.blog').eq(1).should('contain', 'Blog three')
                cy.get('.blog').eq(2).should('contain', 'Blog one')
            })
        })
    })
})