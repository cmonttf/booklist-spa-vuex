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
        <TarjetaIndicador>
          <template #titulo>📚 Total de libros</template>
          <p class="indicador__valor">{{ totalLibros }}</p>
          <p class="indicador__descripcion">Libros registrados en el sistema</p>
        </TarjetaIndicador>

        <TarjetaIndicador color="var(--el-color-warning)">
          <template #titulo>⭐ Favoritos</template>
          <p class="indicador__valor">{{ totalFavoritos }}</p>
          <p class="indicador__descripcion">Libros marcados como favoritos</p>
        </TarjetaIndicador>

        <TarjetaIndicador color="var(--el-color-success)">
          <template #titulo>🏷️ Por categoría</template>
          <ul class="indicador__lista">
            <li v-for="(cantidad, categoria) in librosPorCategoria" :key="categoria">
              <div class="indicador__fila">
                <span>{{ categoria }}</span> <strong>{{ cantidad }}</strong>
              </div>
              <!-- Style binding: el ancho de la barra es el % del total -->
              <div class="indicador__barra">
                <span
                  class="indicador__barra-relleno"
                  :style="{ width: porcentaje(cantidad) + '%' }"
                  :data-porcentaje="porcentaje(cantidad)"
                ></span>
              </div>
            </li>
          </ul>
        </TarjetaIndicador>

        <TarjetaIndicador color="var(--color-acento)">
          <template #titulo>🎯 Por tipo</template>
          <ul v-if="Object.keys(librosPorTipo).length" class="indicador__lista">
            <li v-for="(cantidad, tipo) in librosPorTipo" :key="tipo">
              <div class="indicador__fila">
                <span>{{ tipo }}</span> <strong>{{ cantidad }}</strong>
              </div>
            </li>
          </ul>
          <p v-else class="texto-secundario">Aún no hay libros clasificados por tipo.</p>
        </TarjetaIndicador>

        <TarjetaIndicador color="var(--el-color-info)">
          <template #titulo>📈 Promedio por categoría</template>
          <p class="indicador__valor">{{ promedioLibrosPorCategoria.toFixed(2) }}</p>
          <p class="indicador__descripcion">Libros promedio por cada categoría</p>
        </TarjetaIndicador>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { CATEGORIAS } from '@/store/modules/libros'
import TarjetaIndicador from '@/components/TarjetaIndicador.vue'

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

function porcentaje(cantidad) {
  return totalLibros.value ? Math.round((cantidad / totalLibros.value) * 100) : 0
}

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

<style scoped>
.indicadores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.indicador__valor {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
}

.indicador__descripcion {
  margin: 0.3rem 0 0;
  color: var(--el-text-color-secondary);
  font-size: 0.85rem;
}

.indicador__lista {
  list-style: none;
  margin: 0;
  padding: 0;
}

.indicador__lista li {
  padding: 0.3rem 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.indicador__lista li:last-child {
  border-bottom: none;
}

.indicador__fila {
  display: flex;
  justify-content: space-between;
}

.indicador__barra {
  height: 6px;
  margin-top: 0.3rem;
  border-radius: 999px;
  background-color: var(--el-fill-color);
  overflow: hidden;
}

.indicador__barra-relleno {
  display: block;
  height: 100%;
  border-radius: 999px;
  background-color: var(--el-color-success);
  transition: width 0.3s ease-in-out;
}
</style>
