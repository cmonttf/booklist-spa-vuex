import axios from 'axios'

// Instancia centralizada: el baseURL de la API simulada (json-server) vive en
// un solo lugar. Ningún módulo del store debe importar axios directamente.
export default axios.create({
  baseURL: 'http://localhost:3001'
})
