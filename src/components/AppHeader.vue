<template>
  <header class="encabezado">
    <div class="contenedor encabezado__contenido">
      <h1 class="encabezado__marca">📚 BookList</h1>

      <nav class="navegacion" aria-label="Navegación principal">
        <router-link to="/">Inicio</router-link>
        <router-link to="/libros">
          Libros
          <el-badge
            v-if="totalFavoritos"
            :value="totalFavoritos"
            type="warning"
            class="navegacion__badge"
            :title="`${totalFavoritos} favorito(s)`"
          />
        </router-link>
      </nav>

      <div class="encabezado__acciones">
        <el-switch
          v-model="oscuro"
          inline-prompt
          :active-icon="Moon"
          :inactive-icon="Sunny"
          aria-label="Tema oscuro"
          data-cy="switch-tema"
        />
        <el-button type="warning" @click.once="emit('ayuda')">
          Ayuda inicial
        </el-button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useTema } from '@/composables/useTema'

const emit = defineEmits(['ayuda'])

const store = useStore()
const totalFavoritos = computed(() => store.getters['favoritos/total'])

const { oscuro } = useTema()
</script>

<style scoped>
.encabezado {
  background-color: var(--color-encabezado);
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.encabezado__contenido {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.encabezado__marca {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
}

.encabezado__acciones {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navegacion {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.navegacion a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #eaf1fb;
  text-decoration: none;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: var(--el-border-radius-base);
  transition: background-color 0.15s ease-in-out;
}

.navegacion a:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.navegacion a.router-link-exact-active {
  background-color: var(--color-acento);
  color: #fff;
}

.navegacion__badge :deep(.el-badge__content) {
  border: none;
}

@media (max-width: 600px) {
  .encabezado__contenido {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
