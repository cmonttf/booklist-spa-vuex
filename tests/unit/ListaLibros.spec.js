import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import api from '@/api'
import { crearStore } from '@/store'
import ListaLibros from '@/views/ListaLibros.vue'

// Se reemplaza la instancia de Axios: ninguna prueba hace HTTP real.
jest.mock('@/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}))

function montar(store) {
  return mount(ListaLibros, {
    global: {
      plugins: [store, ElementPlus],
      stubs: { RouterLink: RouterLinkStub }
    }
  })
}

describe('ListaLibros.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  it('muestra una alerta de error y ninguna tarjeta cuando la API falla', async () => {
    api.get.mockRejectedValue(new Error('Network Error'))
    const store = crearStore()
    const wrapper = montar(store)

    await store.dispatch('libros/cargar')
    await flushPromises()

    const alerta = wrapper.find('[data-cy="error-catalogo"]')
    expect(alerta.exists()).toBe(true)
    expect(alerta.text()).toContain('Error al cargar el catálogo')
    expect(alerta.text()).toContain('No se pudo cargar el catálogo')
    expect(wrapper.find('[data-cy="tarjeta-libro"]').exists()).toBe(false)
    expect(wrapper.find('[data-cy="cargando-catalogo"]').exists()).toBe(false)
  })

  it('permite reintentar la carga desde la alerta de error', async () => {
    api.get.mockRejectedValueOnce(new Error('Network Error'))
    const store = crearStore()
    const wrapper = montar(store)
    await store.dispatch('libros/cargar')
    await flushPromises()

    api.get.mockResolvedValueOnce({
      data: [{ id: '1', titulo: '1984', autor: 'George Orwell', categoria: 'Ficción', tipo: 'Novela' }]
    })
    await wrapper.find('[data-cy="error-catalogo"] button').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-cy="error-catalogo"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-cy="tarjeta-libro"]')).toHaveLength(1)
  })
})
