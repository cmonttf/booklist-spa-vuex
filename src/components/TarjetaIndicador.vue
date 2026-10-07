<template>
  <el-card shadow="hover" class="indicador" :style="{ borderTopColor: color }">
    <!-- Style binding (arriba): el color del borde superior llega por prop -->
    <h3 class="indicador__titulo">
      <!-- Slot con nombre: el padre decide el título (texto, ícono, etc.) -->
      <slot name="titulo" />
    </h3>
    <!-- Slot por defecto: el contenido del indicador -->
    <slot />
  </el-card>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'var(--el-color-primary)'
  }
})
</script>

<style scoped>
.indicador {
  border-top-width: 4px;
  border-top-style: solid;
}

.indicador__titulo {
  margin: 0 0 0.6rem;
  color: var(--el-color-primary-dark-2);
  font-size: 1rem;
}
</style>
