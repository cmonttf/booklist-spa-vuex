import api from '@/api'
import { crearStore } from '@/store'

jest.mock('@/api', () => ({ get: jest.fn(), delete: jest.fn() }))

const LIBROS = [
  { id: '1', titulo: 'Don Quijote', autor: 'Miguel de Cervantes', categoria: 'Ficción', tipo: 'Novela' },
  { id: '2', titulo: 'Sapiens', autor: 'Yuval Noah Harari', categoria: 'No Ficción', tipo: 'Historia' },
  { id: '3', titulo: 'JavaScript: The Good Parts', autor: 'Douglas Crockford', categoria: 'Técnico', tipo: 'Manual' }
]

async function storeConLibros() {
  api.get.mockResolvedValue({ data: LIBROS })
  const store = crearStore()
  await store.dispatch('libros/cargar')
  return store
}

const titulos = store => store.getters['libros/filtrados'].map(libro => libro.titulo)

describe('store: getter libros/filtrados', () => {
  beforeEach(() => window.localStorage.clear())

  it('filtra por categoría y por autor (sin distinguir mayúsculas)', async () => {
    const store = await storeConLibros()

    await store.dispatch('filtros/actualizar', { categoria: 'Técnico' })
    expect(titulos(store)).toEqual(['JavaScript: The Good Parts'])

    await store.dispatch('filtros/actualizar', { categoria: '', autor: 'HARARI' })
    expect(titulos(store)).toEqual(['Sapiens'])

    await store.dispatch('filtros/limpiar')
    expect(titulos(store)).toHaveLength(3)
  })

  it('filtra solo favoritos y los persiste en localStorage', async () => {
    const store = await storeConLibros()

    await store.dispatch('favoritos/alternar', '1')
    await store.dispatch('filtros/actualizar', { soloFavoritos: true })

    expect(titulos(store)).toEqual(['Don Quijote'])
    expect(JSON.parse(window.localStorage.getItem('booklist:favoritos'))).toEqual(['1'])
  })

  it('quita el libro de favoritos al eliminarlo', async () => {
    const store = await storeConLibros()
    api.delete.mockResolvedValue({})

    await store.dispatch('favoritos/alternar', '2')
    await store.dispatch('libros/eliminar', '2')

    expect(store.getters['favoritos/ids']).toEqual([])
  })
})
