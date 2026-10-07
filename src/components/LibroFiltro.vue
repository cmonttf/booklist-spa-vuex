<template>
  <el-card class="filtro" shadow="never">
    <el-form label-position="top" class="filtro__campos" @submit.prevent>
      <el-form-item label="Filtrar por autor" for="filtro-autor">
        <el-input
          id="filtro-autor"
          v-bind:model-value="filtros.autor"
          placeholder="Escribe un autor..."
          clearable
          data-cy="filtro-autor"
          @update:model-value="actualizar('autor', $event)"
        />
      </el-form-item>

      <el-form-item label="Filtrar por categoría">
        <el-select
          v-bind:model-value="filtros.categoria"
          placeholder="Todas las categorías"
          clearable
          aria-label="Filtrar por categoría"
          data-cy="filtro-categoria"
          @update:model-value="actualizar('categoria', $event || '')"
        >
          <el-option v-for="categoria in CATEGORIAS" :key="categoria" :label="categoria" :value="categoria" />
        </el-select>
      </el-form-item>

      <el-form-item label="Favoritos">
        <el-checkbox
          v-bind:model-value="filtros.soloFavoritos"
          data-cy="filtro-favoritos"
          @update:model-value="actualizar('soloFavoritos', $event)"
        >
          Solo favoritos
        </el-checkbox>
      </el-form-item>

      <el-form-item v-show="hayFiltros" class="filtro__limpiar">
        <el-button @click="limpiarFiltros">Limpiar filtros</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { CATEGORIAS } from '@/store/modules/libros'

const props = defineProps({
  filtros: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['actualizar:filtros'])

const hayFiltros = computed(() =>
  Boolean(props.filtros.autor || props.filtros.categoria || props.filtros.soloFavoritos)
)

// v-bind explícito arriba (no la forma abreviada ":model-value") para
// demostrar el requerimiento académico de uso de v-bind; se combina con un
// evento personalizado en lugar de v-model porque el objeto es una prop.
function actualizar(campo, valor) {
  emit('actualizar:filtros', { ...props.filtros, [campo]: valor })
}

function limpiarFiltros() {
  emit('actualizar:filtros', { autor: '', categoria: '', soloFavoritos: false })
}
</script>

<style scoped>
.filtro {
  margin-bottom: 1rem;
}

.filtro__campos {
  display: flex;
  flex-wrap: wrap;
  gap: 0 1rem;
  align-items: flex-end;
}

.filtro__campos .el-form-item {
  min-width: 200px;
  margin-bottom: 0.5rem;
}

.filtro__campos .el-select {
  width: 100%;
}

.filtro__campos .filtro__limpiar {
  min-width: auto;
}

@media (max-width: 600px) {
  .filtro__campos .el-form-item {
    min-width: 100%;
  }
}
</style>
