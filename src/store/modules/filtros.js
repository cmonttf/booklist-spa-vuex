// Criterios de búsqueda del catálogo. Viven en Vuex (y no en la vista) para que
// se conserven al navegar entre rutas y para que el getter 'libros/filtrados'
// pueda leerlos desde rootState.
const FILTROS_VACIOS = {
  autor: '',
  categoria: '',
  soloFavoritos: false
}

export default {
  namespaced: true,
  state: () => ({ ...FILTROS_VACIOS }),
  mutations: {
    SET_FILTROS(state, filtros) {
      Object.assign(state, filtros)
    },
    LIMPIAR(state) {
      Object.assign(state, FILTROS_VACIOS)
    }
  },
  actions: {
    actualizar({ commit }, filtros) {
      commit('SET_FILTROS', filtros)
    },
    limpiar({ commit }) {
      commit('LIMPIAR')
    }
  },
  getters: {
    activos: state => Boolean(state.autor.trim() || state.categoria || state.soloFavoritos)
  }
}
