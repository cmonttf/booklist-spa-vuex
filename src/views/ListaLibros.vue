<template>
  <div class="contenedor">
    <section class="seccion">
      <h2 class="seccion__titulo">Agregar un nuevo libro</h2>
      <el-card shadow="never">
        <LibroFormulario @agregar-libro="manejarAgregarLibro" />
      </el-card>
    </section>

    <section class="seccion">
      <h2 class="seccion__titulo">Catálogo de libros</h2>
      <LibroFiltro :filtros="filtros" @actualizar:filtros="actualizarFiltros" />

      <el-skeleton v-if="loading" :rows="5" animated data-cy="cargando-catalogo" />

      <el-alert
        v-else-if="error"
        type="error"
        title="Error al cargar el catálogo"
        show-icon
        :closable="false"
        data-cy="error-catalogo"
      >
        <!-- El slot por defecto reemplaza a la prop "description" -->
        <p class="alerta__mensaje">{{ error }}</p>
        <el-button size="small" class="alerta__accion" @click="cargar">Reintentar</el-button>
      </el-alert>

      <div v-else-if="libros.length" class="rejilla-libros">
        <Libro
          v-for="libro in libros"
          :key="libro.id"
          :libro="libro"
          :es-favorito="esFavorito(libro.id)"
          @eliminar="manejarEliminarLibro"
          @alternar-favorito="alternarFavorito"
        />
      </div>

      <el-empty
        v-else
        :description="filtrosActivos ? 'Ningún libro coincide con los filtros.' : 'No hay libros disponibles.'"
        data-cy="catalogo-vacio"
      />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import Libro from '@/components/Libro.vue'
import LibroFormulario from '@/components/LibroFormulario.vue'
import LibroFiltro from '@/components/LibroFiltro.vue'

const store = useStore()

// 'filtrados' ya aplica autor, categoría y "solo favoritos" (getter de Vuex).
const libros = computed(() => store.getters['libros/filtrados'])
const loading = computed(() => store.getters['libros/loading'])
const error = computed(() => store.getters['libros/error'])
const filtros = computed(() => store.state.filtros)
const filtrosActivos = computed(() => store.getters['filtros/activos'])
const esFavorito = id => store.getters['favoritos/esFavorito'](id)

const cargar = () => store.dispatch('libros/cargar')
const actualizarFiltros = nuevos => store.dispatch('filtros/actualizar', nuevos)
const alternarFavorito = id => store.dispatch('favoritos/alternar', id)

async function manejarAgregarLibro(datosLibro) {
  try {
    await store.dispatch('libros/agregar', datosLibro)
    ElMessage.success(`"${datosLibro.titulo}" se agregó al catálogo.`)
  } catch {
    ElMessage.error('No se pudo guardar el libro. ¿Está corriendo "npm run mock"?')
  }
}

async function manejarEliminarLibro(idLibro) {
  try {
    await store.dispatch('libros/eliminar', idLibro)
    ElMessage.success('Libro eliminado.')
  } catch {
    ElMessage.error('No se pudo eliminar el libro.')
  }
}
</script>
