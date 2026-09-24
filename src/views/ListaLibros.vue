<template>
  <div class="contenedor">
    <section class="seccion">
      <h2 class="seccion__titulo">Agregar un nuevo libro</h2>
      <LibroFormulario @agregar-libro="manejarAgregarLibro" />
    </section>

    <section class="seccion">
      <h2 class="seccion__titulo">Catálogo de libros</h2>
      <LibroFiltro :filtros="filtros" @actualizar:filtros="filtros = $event" />

      <p v-if="loading" class="mensaje-vacio">Cargando catálogo…</p>
      <p v-else-if="error" class="mensaje-error">{{ error }}</p>

      <div v-else-if="librosFiltrados.length" class="rejilla-libros">
        <Libro
          v-for="libro in librosFiltrados"
          :key="libro.id"
          :libro="libro"
          @eliminar="manejarEliminarLibro"
        />
      </div>
      <p v-else class="mensaje-vacio">No hay libros disponibles.</p>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Libro from '@/components/Libro.vue'
import LibroFormulario from '@/components/LibroFormulario.vue'
import LibroFiltro from '@/components/LibroFiltro.vue'

export default {
  name: 'ListaLibros',
  components: { Libro, LibroFormulario, LibroFiltro },
  data() {
    return {
      filtros: {
        autor: '',
        categoria: ''
      }
    }
  },
  computed: {
    ...mapGetters('libros', { libros: 'items', loading: 'loading', error: 'error' }),
    librosFiltrados() {
      const autorBuscado = this.filtros.autor.trim().toLowerCase()
      return this.libros.filter(libro => {
        const coincideAutor = !autorBuscado || libro.autor.toLowerCase().includes(autorBuscado)
        const coincideCategoria = !this.filtros.categoria || libro.categoria === this.filtros.categoria
        return coincideAutor && coincideCategoria
      })
    }
  },
  methods: {
    ...mapActions('libros', { agregarLibro: 'agregar', eliminarLibro: 'eliminar' }),
    manejarAgregarLibro(datosLibro) {
      this.agregarLibro(datosLibro)
    },
    manejarEliminarLibro(idLibro) {
      this.eliminarLibro(idLibro)
    }
  }
}
</script>
