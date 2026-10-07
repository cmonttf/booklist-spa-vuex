<template>
  <div>
    <el-form label-position="top" class="formulario" @submit.prevent="manejarEnvio">
      <div class="formulario__grilla">
        <el-form-item label="Título" for="titulo" required>
          <el-input
            id="titulo"
            v-model="nuevoLibro.titulo"
            placeholder="Ej: El principito"
            @keydown.enter.prevent
            @keyup.enter="manejarEnvio"
          />
        </el-form-item>

        <el-form-item label="Autor" for="autor" required>
          <el-input
            id="autor"
            v-model="nuevoLibro.autor"
            placeholder="Ej: Antoine de Saint-Exupéry"
            @keydown.enter.prevent
            @keyup.enter="manejarEnvio"
          />
        </el-form-item>

        <el-form-item label="Categoría" required>
          <el-select
            v-model="nuevoLibro.categoria"
            placeholder="Selecciona una categoría"
            aria-label="Categoría"
            @change="nuevoLibro.tipo = ''"
          >
            <el-option v-for="categoria in CATEGORIAS" :key="categoria" :label="categoria" :value="categoria" />
          </el-select>
        </el-form-item>

        <el-form-item label="Tipo" required>
          <el-select
            v-model="nuevoLibro.tipo"
            :disabled="!nuevoLibro.categoria"
            :placeholder="nuevoLibro.categoria ? 'Selecciona un tipo' : 'Primero elige una categoría'"
            aria-label="Tipo"
          >
            <el-option v-for="tipo in tiposDisponibles" :key="tipo" :label="tipo" :value="tipo" />
          </el-select>
        </el-form-item>

        <el-form-item label="Año de publicación (opcional)" for="fechaPublicacion">
          <el-input id="fechaPublicacion" v-model="nuevoLibro.fechaPublicacion" placeholder="Ej: 1943" />
        </el-form-item>
      </div>

      <el-form-item label="Descripción (opcional)" for="descripcion">
        <el-input
          id="descripcion"
          v-model="nuevoLibro.descripcion"
          type="textarea"
          :rows="3"
          placeholder="Breve descripción del libro"
        />
      </el-form-item>

      <el-alert
        v-for="error in errores"
        :key="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        class="formulario__error"
      />

      <div class="formulario__acciones">
        <el-button type="primary" native-type="submit">Agregar libro</el-button>
        <el-button @click="mostrarVistaPrevia = !mostrarVistaPrevia">
          {{ mostrarVistaPrevia ? 'Ocultar' : 'Mostrar' }} vista previa
        </el-button>
      </div>
    </el-form>

    <!-- v-show demuestra ocultar/mostrar sin desmontar el bloque del DOM -->
    <div v-show="mostrarVistaPrevia" class="vista-previa">
      <h4>Vista previa en tiempo real</h4>
      <p><strong>Título:</strong> {{ nuevoLibro.titulo || 'Sin título' }}</p>
      <p><strong>Autor:</strong> {{ nuevoLibro.autor || 'Autor no especificado' }}</p>
      <p><strong>Categoría:</strong> {{ nuevoLibro.categoria || 'Sin categoría' }} / {{ nuevoLibro.tipo || 'Sin tipo' }}</p>
      <p><strong>Descripción:</strong> {{ nuevoLibro.descripcion || 'Sin descripción' }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { CATEGORIAS, TIPOS_POR_CATEGORIA } from '@/store/modules/libros'

const LIBRO_VACIO = {
  titulo: '',
  autor: '',
  categoria: '',
  tipo: '',
  descripcion: '',
  fechaPublicacion: ''
}

const emit = defineEmits(['agregar-libro'])

const nuevoLibro = reactive({ ...LIBRO_VACIO })
const errores = ref([])
const mostrarVistaPrevia = ref(true)

const tiposDisponibles = computed(() => TIPOS_POR_CATEGORIA[nuevoLibro.categoria] || [])

function validar() {
  const encontrados = []
  if (!nuevoLibro.titulo.trim()) {
    encontrados.push('Debes ingresar el título del libro.')
  }
  if (!nuevoLibro.autor.trim()) {
    encontrados.push('Debes ingresar el autor del libro.')
  }
  if (!nuevoLibro.categoria) {
    encontrados.push('Debes seleccionar una categoría.')
  }
  if (nuevoLibro.categoria && !nuevoLibro.tipo) {
    encontrados.push('Debes seleccionar un tipo.')
  }
  errores.value = encontrados
  return encontrados.length === 0
}

function reiniciarFormulario() {
  Object.assign(nuevoLibro, LIBRO_VACIO)
  errores.value = []
}

function manejarEnvio() {
  if (!validar()) return

  emit('agregar-libro', { ...nuevoLibro })
  reiniciarFormulario()
}
</script>

<style scoped>
.formulario__grilla {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  column-gap: 1rem;
}

.formulario .el-select {
  width: 100%;
}

.formulario__error {
  margin-bottom: 0.5rem;
}

.formulario__acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.formulario__acciones .el-button + .el-button {
  margin-left: 0;
}

.vista-previa {
  margin-top: 1rem;
  border: 1px dashed var(--el-color-primary);
  border-radius: var(--el-border-radius-base);
  padding: 1rem;
  background-color: var(--el-color-primary-light-9);
}

.vista-previa h4 {
  margin-top: 0;
}
</style>
