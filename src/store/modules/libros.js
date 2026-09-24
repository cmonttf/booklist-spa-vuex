import api from '@/api'

// Categoría: grupo editorial principal. Tipo: subtipo específico dentro de esa
// categoría. Editorial Nova usa esta jerarquía para sus indicadores de gestión.
// Son valores fijos de configuración (no vienen de la API).
export const CATEGORIAS = ['Ficción', 'No Ficción', 'Técnico']

export const TIPOS_POR_CATEGORIA = {
  Ficción: ['Novela', 'Cuento', 'Relato'],
  'No Ficción': ['Ensayo', 'Biografía', 'Historia'],
  Técnico: ['Manual', 'Guía', 'Referencia']
}

export default {
  namespaced: true,
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    AGREGAR(state, item) {
      state.items.push(item)
    },
    EDITAR(state, actualizado) {
      const indice = state.items.findIndex(item => String(item.id) === String(actualizado.id))
      if (indice !== -1) state.items[indice] = actualizado
    },
    ELIMINAR(state, id) {
      state.items = state.items.filter(item => String(item.id) !== String(id))
    },
    SET_LOADING(state, valor) {
      state.loading = valor
    },
    SET_ERROR(state, valor) {
      state.error = valor
    }
  },
  actions: {
    async cargar({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const { data } = await api.get('/libros')
        commit('SET_ITEMS', data)
      } catch {
        commit('SET_ERROR', 'No se pudo cargar el catálogo. ¿Está corriendo "npm run mock"?')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async agregar({ commit }, datos) {
      const { data } = await api.post('/libros', datos)
      commit('AGREGAR', data)
    },
    async editar({ commit }, item) {
      const { data } = await api.put(`/libros/${item.id}`, item)
      commit('EDITAR', data)
    },
    async eliminar({ commit }, id) {
      await api.delete(`/libros/${id}`)
      commit('ELIMINAR', id)
    }
  },
  getters: {
    items: state => state.items,
    loading: state => state.loading,
    error: state => state.error,
    porId: state => id => state.items.find(item => String(item.id) === String(id))
  }
}
