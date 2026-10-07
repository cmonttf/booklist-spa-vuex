import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import NotFound from '@/views/NotFound.vue'

// Mismas rutas mínimas que la app real: la comodín debe ir al final.
function crearRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'inicio', component: { template: '<div />' } },
      { path: '/libros', name: 'lista-libros', component: { template: '<div />' } },
      { path: '/:pathMatch(.*)*', name: 'no-encontrado', component: NotFound }
    ]
  })
}

describe('NotFound.vue (página 404)', () => {
  it('se muestra para una ruta inexistente e indica la URL pedida', async () => {
    const router = crearRouter()
    await router.push('/ruta/que-no-existe')
    await router.isReady()

    const wrapper = mount(NotFound, { global: { plugins: [router, ElementPlus] } })

    expect(router.currentRoute.value.name).toBe('no-encontrado')
    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('/ruta/que-no-existe')
  })

  it('vuelve al inicio al presionar "Ir al inicio"', async () => {
    const router = crearRouter()
    await router.push('/otra-ruta')
    await router.isReady()
    const wrapper = mount(NotFound, { global: { plugins: [router, ElementPlus] } })

    const boton = wrapper.findAll('button').find(b => b.text() === 'Ir al inicio')
    await boton.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/')
  })
})
