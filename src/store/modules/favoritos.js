// Libros marcados como favoritos. Solo se guardan los ids: los datos del libro
// siguen viviendo en el módulo 'libros'. La persistencia en localStorage la
// hace el plugin 'persistirFavoritos' de store/index.js.
export const CLAVE_STORAGE = 'booklist:favoritos'

function leerIdsGuardados() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_STORAGE))
    return Array.isArray(guardado) ? guardado.map(String) : []
  } catch {
    return []
  }
}

export default {
  namespaced: true,
  state: () => ({
    ids: leerIdsGuardados()
  }),
  mutations: {
    ALTERNAR(state, id) {
      const clave = String(id)
      state.ids = state.ids.includes(clave)
        ? state.ids.filter(actual => actual !== clave)
        : [...state.ids, clave]
    },
    QUITAR(state, id) {
      state.ids = state.ids.filter(actual => actual !== String(id))
    }
  },
  actions: {
    alternar({ commit }, id) {
      commit('ALTERNAR', id)
    },
    quitar({ commit }, id) {
      commit('QUITAR', id)
    }
  },
  getters: {
    ids: state => state.ids,
    total: state => state.ids.length,
    esFavorito: state => id => state.ids.includes(String(id))
  }
}
