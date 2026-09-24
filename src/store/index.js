import { createStore } from 'vuex'
import libros from './modules/libros'

export default createStore({
  modules: { libros }
})
