<template>
  <div class="contenedor">
    <el-result icon="error" title="404 — Página no encontrada" data-cy="pagina-404">
      <template #sub-title>
        <p>
          La ruta <code>{{ rutaPedida }}</code> no existe en BookList.
        </p>
      </template>
      <template #extra>
        <div class="acciones-404">
          <el-button type="primary" @click="router.push({ name: 'inicio' })">Ir al inicio</el-button>
          <el-button @click="router.push({ name: 'lista-libros' })">Ver catálogo</el-button>
        </div>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// fullPath conserva la URL tal como la escribió el usuario (con query/hash).
const rutaPedida = computed(() => route.fullPath)
</script>
