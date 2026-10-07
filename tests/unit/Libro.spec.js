import { mount, RouterLinkStub } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import Libro from '@/components/Libro.vue'

const libro = {
  id: '4',
  titulo: 'JavaScript: The Good Parts',
  autor: 'Douglas Crockford',
  categoria: 'Técnico',
  tipo: 'Manual',
  descripcion: 'Un análisis de las mejores características de JavaScript.',
  fechaPublicacion: '2008'
}

function montar(props = {}) {
  return mount(Libro, {
    props: { libro, ...props },
    global: {
      plugins: [ElementPlus],
      stubs: { RouterLink: RouterLinkStub }
    }
  })
}

describe('Libro.vue (tarjeta de producto)', () => {
  it('renderiza los datos del libro recibido por props', () => {
    const wrapper = montar()

    expect(wrapper.find('h3').text()).toBe('JavaScript: The Good Parts')
    expect(wrapper.text()).toContain('Douglas Crockford')
    expect(wrapper.text()).toContain('Técnico · Manual')
    expect(wrapper.text()).toContain('2008')
    expect(wrapper.text()).toContain('Un análisis de las mejores características de JavaScript.')
    expect(wrapper.find('[data-libro-id="4"]').exists()).toBe(true)
    // Los libros técnicos se destacan visualmente.
    expect(wrapper.classes()).toContain('tarjeta-libro--destacada')
  })

  it('muestra un texto alternativo cuando el libro no tiene descripción', () => {
    const wrapper = montar({ libro: { ...libro, descripcion: '' } })

    expect(wrapper.text()).toContain('Sin descripción disponible.')
  })

  it('refleja el estado de favorito y emite "alternar-favorito" con el id', async () => {
    const wrapper = montar({ esFavorito: true })
    const boton = wrapper.find('[data-cy="boton-favorito"]')

    expect(boton.attributes('aria-label')).toBe('Quitar de favoritos')

    await boton.trigger('click')

    expect(wrapper.emitted('alternar-favorito')).toEqual([['4']])
  })

  it('oculta el botón eliminar cuando mostrarBotonEliminar es false', () => {
    const wrapper = montar({ mostrarBotonEliminar: false })

    expect(wrapper.text()).not.toContain('Eliminar')
  })
})
