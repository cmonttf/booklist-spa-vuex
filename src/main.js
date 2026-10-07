import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import es from 'element-plus/es/locale/lang/es'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import store from './store'
// Se importa antes de montar para que la primera pintura ya use el tema guardado.
import './composables/useTema'
import './assets/estilos.css'

createApp(App).use(ElementPlus, { locale: es }).use(router).use(store).mount('#app')
