import { mount, flushPromises, enableAutoUnmount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import NotFound from '@/views/NotFound.vue'

// Desmonta cada componente al terminar su prueba (dispara onBeforeUnmount).
enableAutoUnmount(afterEach)

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

async function montarEn(ruta) {
  const router = crearRouter()
  await router.push(ruta)
  await router.isReady()
  const wrapper = mount(NotFound, { global: { plugins: [router, ElementPlus] } })
  return { router, wrapper }
}

describe('NotFound.vue (página 404)', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('se muestra para una ruta inexistente e indica la URL pedida', async () => {
    const { router, wrapper } = await montarEn('/ruta/que-no-existe')

    expect(router.currentRoute.value.name).toBe('no-encontrado')
    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('/ruta/que-no-existe')
  })

  it('vuelve al inicio al presionar "Ir al inicio"', async () => {
    const { router, wrapper } = await montarEn('/otra-ruta')

    const boton = wrapper.findAll('button').find(b => b.text() === 'Ir al inicio')
    await boton.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/')
  })

  it('cuenta hacia atrás y redirige al inicio a los 10 segundos', async () => {
    const { router, wrapper } = await montarEn('/sin-ruta')
    // El intervalo se crea en onMounted; se vuelve a montar con timers falsos.
    wrapper.unmount()
    jest.useFakeTimers()
    const conTimers = mount(NotFound, { global: { plugins: [router, ElementPlus] } })

    expect(conTimers.find('[data-cy="cuenta-regresiva"]').text()).toContain('10')

    jest.advanceTimersByTime(3000)
    await conTimers.vm.$nextTick()
    expect(conTimers.find('[data-cy="cuenta-regresiva"]').text()).toContain('7')

    jest.advanceTimersByTime(7000)
    jest.useRealTimers()
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('limpia el intervalo en onBeforeUnmount', async () => {
    const { wrapper } = await montarEn('/sin-ruta')
    const espia = jest.spyOn(window, 'clearInterval')

    wrapper.unmount()

    expect(espia).toHaveBeenCalled()
    espia.mockRestore()
  })
})
