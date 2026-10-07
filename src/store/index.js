import { createStore } from 'vuex'
import libros from './modules/libros'
import filtros from './modules/filtros'
import favoritos, { CLAVE_STORAGE } from './modules/favoritos'

// Guarda los favoritos en localStorage cada vez que cambian, sin meter efectos
// secundarios dentro de las mutaciones.
function persistirFavoritos(store) {
  store.subscribe((mutacion, state) => {
    if (!mutacion.type.startsWith('favoritos/')) return
    try {
      window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(state.favoritos.ids))
    } catch {
      // Sin almacenamiento disponible (modo privado, etc.): se ignora.
    }
  })
}

// Fábrica: las pruebas unitarias crean un store limpio por cada caso.
export function crearStore() {
  return createStore({
    modules: { libros, filtros, favoritos },
    plugins: [persistirFavoritos]
  })
}

export default crearStore()
