<template>
  <div class="contenedor">
    <section class="seccion">
      <h2 class="seccion__titulo">Bienvenido a {{ nombreApp }}</h2>
      <p>{{ descripcionApp }}</p>
      <p>
        Hola, <strong>{{ usuario.nombre }}</strong>. Explora el catálogo de libros,
        agrega tus propios títulos y organiza tu biblioteca personal.
      </p>
      <router-link v-slot="{ navigate }" to="/libros" custom>
        <el-button type="primary" @click="navigate">Ver listado de libros</el-button>
      </router-link>
    </section>

    <section class="seccion">
      <h2 class="seccion__titulo">📊 Resumen de gestión — Editorial Nova</h2>
      <p>Indicadores calculados en tiempo real a partir del catálogo (propiedades <code>computed</code>).</p>

      <el-skeleton v-if="loading" :rows="4" animated />
      <el-alert
        v-else-if="error"
        type="error"
        title="Error al cargar el catálogo"
        :description="error"
        show-icon
        :closable="false"
      />

      <div v-else class="indicadores-grid">
        <el-card shadow="hover" class="indicador">
          <h3>📚 Total de libros</h3>
          <p class="indicador__valor">{{ totalLibros }}</p>
          <p class="indicador__descripcion">Libros registrados en el sistema</p>
        </el-card>

        <el-card shadow="hover" class="indicador">
          <h3>⭐ Favoritos</h3>
          <p class="indicador__valor">{{ totalFavoritos }}</p>
          <p class="indicador__descripcion">Libros marcados como favoritos</p>
        </el-card>

        <el-card shadow="hover" class="indicador">
          <h3>🏷️ Por categoría</h3>
          <ul class="indicador__lista">
            <li v-for="(cantidad, categoria) in librosPorCategoria" :key="categoria">
              <span>{{ categoria }}</span> <strong>{{ cantidad }}</strong>
            </li>
          </ul>
        </el-card>

        <el-card shadow="hover" class="indicador">
          <h3>🎯 Por tipo</h3>
          <ul v-if="Object.keys(librosPorTipo).length" class="indicador__lista">
            <li v-for="(cantidad, tipo) in librosPorTipo" :key="tipo">
              <span>{{ tipo }}</span> <strong>{{ cantidad }}</strong>
            </li>
          </ul>
          <p v-else class="texto-secundario">Aún no hay libros clasificados por tipo.</p>
        </el-card>

        <el-card shadow="hover" class="indicador">
          <h3>📈 Promedio por categoría</h3>
          <p class="indicador__valor">{{ promedioLibrosPorCategoria.toFixed(2) }}</p>
          <p class="indicador__descripcion">Libros promedio por cada categoría</p>
        </el-card>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { CATEGORIAS } from '@/store/modules/libros'

const nombreApp = 'BookList'
const descripcionApp = 'Un gestor de libros interactivo construido con Vue.js, pensado para practicar componentes, reactividad y enrutamiento.'
const usuario = reactive({
  nombre: 'Admin Editorial Nova'
})

// 'libros' (state.items), 'loading' y 'error' vienen del módulo Vuex 'libros',
// cargado por App.vue al iniciar la app.
const store = useStore()
const libros = computed(() => store.getters['libros/items'])
const loading = computed(() => store.getters['libros/loading'])
const error = computed(() => store.getters['libros/error'])
const totalFavoritos = computed(() => store.getters['favoritos/total'])

const totalLibros = computed(() => libros.value.length)

const librosPorCategoria = computed(() => {
  const resultado = {}
  CATEGORIAS.forEach(categoria => {
    resultado[categoria] = 0
  })
  libros.value.forEach(libro => {
    if (Object.prototype.hasOwnProperty.call(resultado, libro.categoria)) {
      resultado[libro.categoria]++
    }
  })
  return resultado
})

const librosPorTipo = computed(() => {
  const resultado = {}
  libros.value.forEach(libro => {
    resultado[libro.tipo] = (resultado[libro.tipo] || 0) + 1
  })
  return resultado
})

const promedioLibrosPorCategoria = computed(() => totalLibros.value / CATEGORIAS.length)

// La carga es asíncrona (dispatch en App.vue), así que el conteo real solo se
// conoce cuando 'loading' pasa de true a false.
watch(loading, (actual, anterior) => {
  if (anterior && !actual) {
    console.log('📚 Libros iniciales:', libros.value.length)
  }
})

onMounted(() => {
  console.log('✅ Vista de inicio montada correctamente')
  console.log('👤 Usuario:', usuario.nombre)
})
</script>
