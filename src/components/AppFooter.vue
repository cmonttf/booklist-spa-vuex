<template>
  <footer class="pie-pagina">
    BookList SPA &mdash; Proyecto académico construido con Vue.js 3 (Composition API),
    Vue CLI, Vuex y Element Plus. &copy; {{ anio }}
  </footer>
</template>

<script setup>
const anio = new Date().getFullYear()
</script>

<style scoped>
.pie-pagina {
  text-align: center;
  padding: 1rem;
  color: var(--el-text-color-secondary);
  font-size: 0.85rem;
}
</style>
