import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import TarjetaIndicador from '@/components/TarjetaIndicador.vue'

describe('TarjetaIndicador.vue', () => {
  it('distribuye el contenido en el slot con nombre "titulo" y en el slot por defecto', () => {
    const wrapper = mount(TarjetaIndicador, {
      global: { plugins: [ElementPlus] },
      slots: {
        titulo: '📚 Total de libros',
        default: '<p class="valor">5</p>'
      }
    })

    expect(wrapper.find('h3').text()).toBe('📚 Total de libros')
    expect(wrapper.find('.valor').text()).toBe('5')
  })

  it('aplica el color recibido por prop mediante style binding', () => {
    const wrapper = mount(TarjetaIndicador, {
      global: { plugins: [ElementPlus] },
      props: { color: 'rgb(232, 118, 58)' }
    })

    expect(wrapper.attributes('style')).toContain('border-top-color: rgb(232, 118, 58)')
  })
})
