import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '@/views/InicioView.vue'
import ListaLibros from '@/views/ListaLibros.vue'
import DetalleLibro from '@/views/DetalleLibro.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: InicioView
  },
  {
    path: '/libros',
    name: 'lista-libros',
    component: ListaLibros
  },
  {
    path: '/libros/:id',
    name: 'detalle-libro',
    component: DetalleLibro,
    props: true
  },
  {
    // Ruta comodín: cualquier URL que no coincida con las anteriores (debe ir
    // al final). pathMatch captura la ruta pedida para mostrarla en la 404.
    path: '/:pathMatch(.*)*',
    name: 'no-encontrado',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
