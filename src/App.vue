<template>
  <AppHeader @ayuda="bienvenidaVisible = true" />

  <!-- v-show: se oculta sin desmontar el bloque, útil para un aviso puntual -->
  <div v-show="bienvenidaVisible" class="contenedor contenedor--aviso">
    <el-alert type="info" title="¡Bienvenido/a a BookList!" show-icon @close="bienvenidaVisible = false">
      Este mensaje de ayuda solo se muestra la primera vez que presionas el botón
      "Ayuda inicial" (evento con modificador <code>.once</code>). Usa la navegación
      superior para moverte entre el inicio y el listado de libros, marca tus
      favoritos con la estrella y cambia entre tema claro y oscuro con el switch.
    </el-alert>
  </div>

  <main class="contenido-principal">
    <router-view />
  </main>

  <AppFooter />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const store = useStore()
const bienvenidaVisible = ref(false)

// Se carga una sola vez al montar la app, sin importar por qué ruta entre el
// usuario: todas las vistas leen el mismo estado de Vuex.
onMounted(() => {
  store.dispatch('libros/cargar')
})
</script>
