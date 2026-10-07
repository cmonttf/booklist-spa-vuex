<template>
  <el-card
    class="tarjeta-libro"
    v-bind:class="{ 'tarjeta-libro--destacada': libro.categoria === 'Técnico' }"
    shadow="hover"
    v-bind:data-libro-id="libro.id"
    data-cy="tarjeta-libro"
  >
    <div class="tarjeta-libro__cabecera">
      <el-tag size="small" effect="plain">{{ libro.categoria }} · {{ libro.tipo }}</el-tag>
      <el-button
        :type="esFavorito ? 'warning' : 'default'"
        :icon="esFavorito ? StarFilled : Star"
        circle
        size="small"
        :aria-label="esFavorito ? 'Quitar de favoritos' : 'Marcar como favorito'"
        :aria-pressed="String(esFavorito)"
        data-cy="boton-favorito"
        @click="emit('alternar-favorito', libro.id)"
      />
    </div>

    <h3 class="tarjeta-libro__titulo">{{ libro.titulo }}</h3>
    <p><strong>Autor:</strong> {{ libro.autor }}</p>
    <p v-if="libro.fechaPublicacion"><strong>Año:</strong> {{ libro.fechaPublicacion }}</p>
    <p v-if="libro.descripcion">{{ descripcionResumida }}</p>
    <p v-else class="texto-secundario">Sin descripción disponible.</p>

    <div class="tarjeta-libro__acciones">
      <router-link v-slot="{ navigate }" :to="{ name: 'detalle-libro', params: { id: libro.id } }" custom>
        <el-button type="primary" plain @click="navigate">Ver detalle</el-button>
      </router-link>
      <el-popconfirm
        v-if="mostrarBotonEliminar"
        :title="tituloConfirmacion"
        confirm-button-text="Eliminar"
        cancel-button-text="Cancelar"
        confirm-button-type="danger"
        width="240"
        @confirm="emit('eliminar', libro.id)"
      >
        <template #reference>
          <el-button type="danger" plain>Eliminar</el-button>
        </template>
      </el-popconfirm>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'

const props = defineProps({
  libro: {
    type: Object,
    required: true
  },
  mostrarBotonEliminar: {
    type: Boolean,
    default: true
  },
  esFavorito: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['eliminar', 'alternar-favorito'])

const LIMITE_DESCRIPCION = 120

const descripcionResumida = computed(() => {
  const { descripcion } = props.libro
  return descripcion.length > LIMITE_DESCRIPCION
    ? descripcion.slice(0, LIMITE_DESCRIPCION) + '…'
    : descripcion
})

const tituloConfirmacion = computed(() => `¿Eliminar el libro "${props.libro.titulo}"?`)
</script>

<style scoped>
/* :deep llega al cuerpo interno de el-card, que no pertenece a este componente */
.tarjeta-libro :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  height: 100%;
}

.tarjeta-libro p {
  margin: 0;
}

.tarjeta-libro--destacada {
  border-left: 4px solid var(--color-acento);
}

.tarjeta-libro__cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.tarjeta-libro__titulo {
  margin: 0.3rem 0 0.2rem;
}

.tarjeta-libro__acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: auto;
  padding-top: 0.6rem;
}

.tarjeta-libro__acciones .el-button + .el-button {
  margin-left: 0;
}
</style>
