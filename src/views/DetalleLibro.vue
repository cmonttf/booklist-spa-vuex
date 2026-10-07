<template>
  <div class="contenedor">
    <el-skeleton v-if="loading" :rows="5" animated />
    <el-alert
      v-else-if="error"
      type="error"
      title="Error al cargar el catálogo"
      :description="error"
      show-icon
      :closable="false"
    />

    <el-card v-else-if="libro" shadow="never" class="detalle-libro">
      <div class="detalle-libro__cabecera">
        <el-tag effect="plain">{{ libro.categoria }} · {{ libro.tipo }}</el-tag>
        <el-button :type="favorito ? 'warning' : 'default'" @click="alternarFavorito">
          {{ favorito ? '★ En favoritos' : '☆ Marcar como favorito' }}
        </el-button>
      </div>
      <h2>{{ libro.titulo }}</h2>
      <p><strong>Autor:</strong> {{ libro.autor }}</p>
      <p v-if="libro.fechaPublicacion"><strong>Año de publicación:</strong> {{ libro.fechaPublicacion }}</p>
      <p><strong>Descripción:</strong></p>
      <p>{{ libro.descripcion || 'Sin descripción disponible.' }}</p>
      <router-link v-slot="{ navigate }" to="/libros" custom>
        <el-button @click="navigate">&larr; Volver al listado</el-button>
      </router-link>
    </el-card>

    <el-result
      v-else
      icon="warning"
      title="Libro no encontrado"
      :sub-title="`No se encontró ningún libro con el identificador &quot;${id}&quot;.`"
    >
      <template #extra>
        <router-link v-slot="{ navigate }" to="/libros" custom>
          <el-button type="primary" @click="navigate">Volver al listado</el-button>
        </router-link>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const store = useStore()
const loading = computed(() => store.getters['libros/loading'])
const error = computed(() => store.getters['libros/error'])
const libro = computed(() => store.getters['libros/porId'](props.id))
const favorito = computed(() => store.getters['favoritos/esFavorito'](props.id))

function alternarFavorito() {
  store.dispatch('favoritos/alternar', props.id)
}
</script>

<style scoped>
.detalle-libro__cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detalle-libro h2 {
  margin-bottom: 0.5rem;
}
</style>
