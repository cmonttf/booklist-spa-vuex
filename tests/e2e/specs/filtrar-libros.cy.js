// Flujo: el usuario abre el catálogo, filtra por categoría y por autor, y ve
// solo los libros que coinciden. La API se simula con cy.intercept, así que la
// prueba no depende de que json-server esté corriendo.
describe('Filtrar el catálogo de libros', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/libros', { fixture: 'libros.json' }).as('libros')
    cy.visit('/libros')
    cy.wait('@libros')
  })

  it('muestra solo los libros de la categoría elegida', () => {
    cy.get('[data-cy="tarjeta-libro"]').should('have.length', 5)

    cy.get('[data-cy="filtro-categoria"]').click()
    cy.get('.el-select-dropdown__item:visible').contains('Técnico').click()

    cy.get('[data-cy="tarjeta-libro"]')
      .should('have.length', 1)
      .first()
      .should('contain', 'JavaScript: The Good Parts')
      .and('contain', 'Técnico')
  })

  it('combina el filtro por autor y muestra el estado vacío si nada coincide', () => {
    cy.get('input[data-cy="filtro-autor"]').type('orwell')

    cy.get('[data-cy="tarjeta-libro"]').should('have.length', 1).first().should('contain', '1984')

    cy.get('[data-cy="filtro-categoria"]').click()
    cy.get('.el-select-dropdown__item:visible').contains('Técnico').click()

    cy.get('[data-cy="tarjeta-libro"]').should('not.exist')
    cy.get('[data-cy="catalogo-vacio"]').should('contain', 'Ningún libro coincide con los filtros.')

    cy.contains('button', 'Limpiar filtros').click()
    cy.get('[data-cy="tarjeta-libro"]').should('have.length', 5)
  })
})

describe('Página 404', () => {
  it('muestra la 404 para una URL inexistente y permite volver al inicio', () => {
    cy.intercept('GET', 'http://localhost:3001/libros', { fixture: 'libros.json' })
    cy.visit('/esta-pagina-no-existe')

    cy.get('[data-cy="pagina-404"]')
      .should('contain', '404')
      .and('contain', '/esta-pagina-no-existe')

    cy.contains('button', 'Ir al inicio').click()
    cy.location('pathname').should('eq', '/')
  })
})
