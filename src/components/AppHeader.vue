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
