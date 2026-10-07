<template>
  <div class="contenedor">
    <el-result icon="error" title="404 — Página no encontrada" data-cy="pagina-404">
      <template #sub-title>
        <p>
          La ruta <code>{{ rutaPedida }}</code> no existe en BookList.
        </p>
        <p class="redireccion" data-cy="cuenta-regresiva">
          Volverás al inicio automáticamente en <strong>{{ segundos }}</strong> s.
        </p>
      </template>
      <template #extra>
        <div class="acciones-404">
          <el-button type="primary" @click="irAlInicio">Ir al inicio</el-button>
          <el-button @click="router.push({ name: 'lista-libros' })">Ver catálogo</el-button>
        </div>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const SEGUNDOS_REDIRECCION = 10

const route = useRoute()
const router = useRouter()

// fullPath conserva la URL tal como la escribió el usuario (con query/hash).
const rutaPedida = computed(() => route.fullPath)

const segundos = ref(SEGUNDOS_REDIRECCION)
let intervalo = null

function irAlInicio() {
  router.push({ name: 'inicio' })
}

// Ciclo de vida: el temporizador se crea al montar y se limpia antes de
// desmontar (por ejemplo, si el usuario navega con un botón antes de que
// termine la cuenta), para no dejar un intervalo vivo.
onMounted(() => {
  intervalo = setInterval(() => {
    segundos.value--
    if (segundos.value <= 0) {
      clearInterval(intervalo)
      irAlInicio()
    }
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(intervalo)
})
</script>

<style scoped>
.redireccion {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.acciones-404 {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.acciones-404 .el-button + .el-button {
  margin-left: 0;
}
</style>
