<template>
  <footer class="pie-pagina">
    BookList SPA &mdash; Proyecto académico construido con Vue.js 3 (Composition API),
    Vue CLI, Vuex y Element Plus. &copy; {{ anio }}
  </footer>
</template>

<script setup>
const anio = new Date().getFullYear()
</script>
