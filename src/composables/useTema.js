import { ref, watch } from 'vue'

// Tema claro/oscuro. Element Plus activa su paleta oscura cuando <html> tiene
// la clase "dark"; los estilos propios (estilos.css) usan las mismas variables
// --el-*, así que todo cambia junto.
const CLAVE_STORAGE = 'booklist:tema'

function leerPreferencia() {
  try {
    const guardado = window.localStorage.getItem(CLAVE_STORAGE)
    if (guardado === 'oscuro') return true
    if (guardado === 'claro') return false
  } catch {
    // Sin almacenamiento disponible: se usa la preferencia del sistema.
  }
  return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
}

// Estado compartido a nivel de módulo: todos los componentes que llamen a
// useTema() ven y modifican el mismo ref.
const oscuro = ref(leerPreferencia())

// La clase se aplica de inmediato; la elección solo se guarda cuando el
// usuario cambia el tema (si nunca lo cambia, se sigue la del sistema).
watch(oscuro, valor => document.documentElement.classList.toggle('dark', valor), { immediate: true })

watch(oscuro, valor => {
  try {
    window.localStorage.setItem(CLAVE_STORAGE, valor ? 'oscuro' : 'claro')
  } catch {
    // Se ignora: el tema sigue aplicado durante la sesión.
  }
})

export function useTema() {
  function alternarTema() {
    oscuro.value = !oscuro.value
  }

  return { oscuro, alternarTema }
}
