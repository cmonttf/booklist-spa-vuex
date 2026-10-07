# BookList SPA

## Descripción

BookList es una aplicación de página única (SPA) construida con Vue.js que permite
gestionar el catálogo de libros de **Editorial Nova**: agregar libros mediante un
formulario reactivo, visualizarlos en un listado, filtrarlos por autor o categoría,
eliminarlos, consultar el detalle individual de cada uno a través de una ruta
dinámica, y monitorear el catálogo mediante un dashboard de indicadores en tiempo
real. Permite además marcar libros como favoritos y alternar entre tema claro y
oscuro.

El proyecto fue desarrollado como trabajo académico para demostrar el uso de
componentes con **Composition API** (`<script setup>`), reactividad, directivas,
formularios con `v-model`, manejo de eventos, Vue Router (con página 404),
estado global con Vuex, pruebas automatizadas y una librería UI, siguiendo el
patrón **MVVM**. El proyecto se gestiona con **Vue CLI** (`vue-cli-service`).

## Funcionalidades

- Pantalla de inicio con dashboard de indicadores de gestión (total de libros, por
  categoría, por tipo y promedio por categoría), calculados en tiempo real.
- Listado de libros con tarjetas reutilizables.
- Agregar libros mediante formulario con selects dependientes (categoría → tipo) y
  vista previa en tiempo real.
- Validación de campos obligatorios (título, autor, categoría, tipo).
- Filtrar libros por autor, por categoría y "solo favoritos" (filtros guardados en Vuex).
- Marcar y desmarcar libros como favoritos (se conservan al recargar la página).
- Eliminar libros con confirmación.
- Ver el detalle individual de cada libro mediante rutas dinámicas (`/libros/:id`).
- Navegación 100% SPA con Vue Router (sin recargas de página).
- Manejo correcto de identificadores de libro inexistentes.
- Página 404 para cualquier URL que no exista.
- Estados de carga, error (con botón "Reintentar") y catálogo vacío.
- Tema claro/oscuro (respeta la preferencia del sistema y recuerda la elección).
- Diseño responsive (escritorio y móvil).

## Tecnologías

- Vue.js 3 con **Composition API** (`<script setup>`, `ref`, `reactive`, `computed`, `watch`, `onMounted`)
- Vue Router 4 (`useRoute`/`useRouter`, ruta comodín para la 404)
- Vuex 4 (estado global con `useStore()`, módulos namespaced `libros`, `filtros` y `favoritos`)
- Axios (cliente HTTP centralizado)
- json-server (API REST simulada para persistencia local)
- JavaScript (ES2015+)
- Element Plus (librería de componentes UI, con modo oscuro) + `@element-plus/icons-vue`
- Jest 27 + Vue Test Utils 2 (pruebas unitarias, vía `@vue/cli-plugin-unit-jest`)
- Cypress 13 (pruebas end-to-end)
- Vue CLI 5 (`@vue/cli-service`, basado en Webpack 5)

**Este proyecto no utiliza Vite ni un `webpack.config.js` propio.** Todo se
ejecuta con Vue CLI (`vue-cli-service serve`, `build` y `test:unit`), que usa
Webpack internamente y se ajusta solo desde `vue.config.js`. La compatibilidad de
navegadores se define mediante el archivo `.browserslistrc` en la raíz del
proyecto, leído tanto por Babel (`babel.config.js` con
`@vue/cli-plugin-babel/preset`) como por el resto de herramientas de Vue CLI.

## Instalación

```bash
npm install
```

## Ejecución

La app necesita **dos procesos corriendo en paralelo** (dos terminales): la API
simulada (json-server) y el servidor de desarrollo de Vue CLI.

**Terminal 1 — API simulada**, sirve `db.json` en `http://localhost:3001`:

```bash
npm run mock
```

**Terminal 2 — servidor de desarrollo**, con recarga en caliente:

```bash
npm run serve
```

La aplicación queda disponible en `http://localhost:8080`. Si `npm run mock`
no está corriendo, la app sigue funcionando pero el catálogo no carga (se
muestra un mensaje de error controlado en pantalla).

Compilación de producción:

```bash
npm run build
```

Los archivos generados se ubican en la carpeta `dist/` (`index.html` +
`js/app.[hash].js` + `js/chunk-vendors.[hash].js` + `css/app.[hash].css` +
`css/chunk-vendors.[hash].css`). Al abrirlos, la app sigue necesitando la API
simulada corriendo en `http://localhost:3001` (`npm run mock`), ya que el
catálogo de libros se obtiene por HTTP y no queda embebido en el bundle.

## Pruebas

**Unitarias** (Jest + Vue Test Utils, con el plugin oficial de Vue CLI). No
necesitan servidor ni API: Axios se reemplaza con `jest.mock('@/api')`.

```bash
npm run test:unit
```

**End-to-end** (Cypress). El script levanta solo el servidor de desarrollo,
espera a que responda en `http://localhost:8080`, ejecuta Cypress en modo
headless y apaga el servidor al terminar. La API se simula con `cy.intercept`
y el fixture `tests/e2e/fixtures/libros.json`, así que **no** hace falta
`npm run mock`.

```bash
npm run test:e2e        # headless, para consola/CI
npm run cypress:open    # modo interactivo (requiere "npm run serve" en otra terminal)
```

| Archivo | Tipo | Qué valida |
|---|---|---|
| [tests/unit/Libro.spec.js](./tests/unit/Libro.spec.js) | Unitaria | Render correcto de la tarjeta (`Libro.vue`, equivalente a `<ProductCard>`): título, autor, categoría · tipo, año, descripción, estilo destacado, texto alternativo sin descripción, estado de favorito y evento `alternar-favorito`. |
| [tests/unit/ListaLibros.spec.js](./tests/unit/ListaLibros.spec.js) | Unitaria | Respuesta visual ante error de API: con `api.get` rechazado se muestra la alerta de error y ninguna tarjeta; el botón "Reintentar" vuelve a cargar y muestra los libros. |
| [tests/unit/store.spec.js](./tests/unit/store.spec.js) | Unitaria | Getter `libros/filtrados` (categoría, autor, solo favoritos), persistencia de favoritos en `localStorage` y limpieza del favorito al eliminar un libro. |
| [tests/unit/NotFound.spec.js](./tests/unit/NotFound.spec.js) | Unitaria | La ruta comodín resuelve a la 404, que muestra la URL pedida y vuelve al inicio. |
| [tests/e2e/specs/filtrar-libros.cy.js](./tests/e2e/specs/filtrar-libros.cy.js) | E2E | El usuario filtra por categoría y ve solo los resultados que coinciden; combina filtros, ve el estado vacío y limpia los filtros. También recorre la página 404. |

Resultado de la última ejecución:

```text
$ npm run test:unit
PASS tests/unit/store.spec.js
PASS tests/unit/NotFound.spec.js
PASS tests/unit/Libro.spec.js
PASS tests/unit/ListaLibros.spec.js
Test Suites: 4 passed, 4 total
Tests:       11 passed, 11 total

$ npm run test:e2e
  Filtrar el catálogo de libros
    ✓ muestra solo los libros de la categoría elegida
    ✓ combina el filtro por autor y muestra el estado vacío si nada coincide
  Página 404
    ✓ muestra la 404 para una URL inexistente y permite volver al inicio
  3 passing
```

> **Si Cypress falla con `bad option: --smoke-test`** al ejecutarlo desde la
> terminal integrada de VS Code: esa terminal puede heredar la variable
> `ELECTRON_RUN_AS_NODE=1`, que impide abrir Cypress. Ejecútalo desde una
> terminal externa o elimina la variable primero
> (PowerShell: `Remove-Item Env:ELECTRON_RUN_AS_NODE`).

## Estructura del proyecto

```text
booklist-spa/
├── public/
│   └── index.html                # Plantilla HTML base (un solo <div id="app">)
├── src/
│   ├── api/
│   │   └── index.js              # Instancia de Axios (baseURL de json-server)
│   ├── assets/
│   │   └── estilos.css           # Layout propio sobre las variables --el-* de Element Plus
│   ├── components/
│   │   ├── AppHeader.vue         # Encabezado: navegación, switch de tema, ayuda
│   │   ├── AppFooter.vue         # Pie de página
│   │   ├── Libro.vue             # Tarjeta reutilizable de un libro (ProductCard)
│   │   ├── LibroFormulario.vue   # Formulario para agregar libros
│   │   └── LibroFiltro.vue       # Filtro por autor, categoría y favoritos
│   ├── composables/
│   │   └── useTema.js            # Tema claro/oscuro (estado compartido con ref)
│   ├── router/
│   │   └── index.js              # Definición de rutas (Vue Router) + ruta 404
│   ├── store/
│   │   ├── index.js              # crearStore(): une los módulos + plugin de persistencia
│   │   └── modules/
│   │       ├── libros.js         # Catálogo (Model + acceso a la API + getter filtrados)
│   │       ├── filtros.js        # Criterios de búsqueda (autor, categoría, solo favoritos)
│   │       └── favoritos.js      # Ids de libros favoritos
│   ├── views/
│   │   ├── InicioView.vue        # "/" — dashboard de indicadores
│   │   ├── ListaLibros.vue       # "/libros" — gestión del catálogo
│   │   ├── DetalleLibro.vue      # "/libros/:id" — detalle de un libro
│   │   └── NotFound.vue          # Cualquier otra ruta — página 404
│   ├── App.vue                   # Layout raíz: <AppHeader> + <router-view> + <AppFooter>
│   └── main.js                   # Punto de entrada: Element Plus + router + store
├── tests/
│   ├── unit/                     # Jest + Vue Test Utils (*.spec.js)
│   └── e2e/
│       ├── fixtures/libros.json  # Datos simulados para cy.intercept
│       └── specs/                # Cypress (*.cy.js)
├── db.json                       # Base de datos simulada (json-server)
├── .browserslistrc
├── babel.config.js
├── vue.config.js                 # Configuración de Vue CLI
├── jest.config.js                # Preset de Jest de Vue CLI
├── cypress.config.js             # Configuración de Cypress
├── package.json
└── README.md
```

## Cómo se construyó — componentes y arquitectura

El proyecto sigue el patrón **MVVM**, apoyado en una arquitectura modular (en vez
de un único archivo monolítico) para mantener responsabilidades separadas:

- **Model** — el estado vive en tres módulos Vuex namespaced (`libros`,
  `filtros` y `favoritos`, ver [Estado global](#estado-global--módulos-vuex)).
  El principal es [src/store/modules/libros.js](./src/store/modules/libros.js). Ahí se define
  el `state` (`items`, `loading`, `error`), las `mutations` que lo modifican
  (`SET_ITEMS`, `AGREGAR`, `EDITAR`, `ELIMINAR`, `SET_LOADING`, `SET_ERROR`),
  las `actions` asíncronas que hablan con la API (`cargar`, `agregar`,
  `editar`, `eliminar`) y los `getters` que exponen el estado de forma
  derivada (`items`, `loading`, `error`, `porId`, `filtrados`). También exporta las
  constantes `CATEGORIAS` (`Ficción`, `No Ficción`, `Técnico`) y
  `TIPOS_POR_CATEGORIA` (el subtipo específico dentro de cada categoría, p. ej.
  `Novela`, `Ensayo`, `Manual`) — son configuración fija, no vienen de la API.
  Cada libro tiene: `id`, `titulo`, `autor`, `categoria`, `tipo`, `descripcion`
  y `fechaPublicacion`.

  Como el estado vive en un único store Vuex compartido, todas las vistas que
  lo consultan (`useStore()` + `computed`) quedan sincronizadas
  automáticamente entre sí — se mantiene consistente al navegar entre `/`,
  `/libros` y `/libros/:id`, sin volver a pedir los datos a la API en cada
  vista. Ver la sección [Persistencia de datos](#persistencia-de-datos--vuex--axios--json-server)
  más abajo para el detalle de cómo se conecta con el backend simulado.

- **View** — el `<template>` de cada componente `.vue`.

- **ViewModel** — el bloque `<script setup>` de cada componente: `ref`,
  `reactive`, `computed` y funciones (por ejemplo los indicadores del
  dashboard en `InicioView.vue`), junto con los getters de Vuex (como
  `libros/filtrados`), que conectan el modelo con la vista sin lógica compleja
  embebida en el template.

### Composition API

Todos los componentes y vistas usan `<script setup>` (Composition API). No
queda ningún componente con Options API (`data`, `methods`, `computed:{}`).

| Concepto | Dónde se usa |
|---|---|
| `ref` / `reactive` | `LibroFormulario.vue` (`reactive(nuevoLibro)`, `ref(errores)`), `App.vue` (`ref(bienvenidaVisible)`), `InicioView.vue` (`reactive(usuario)`) |
| `computed` | Todas las vistas leen Vuex con `computed(() => store.getters[...])`; indicadores del dashboard; `tiposDisponibles` del formulario |
| `watch` | `InicioView.vue` (detecta el fin de la carga) y `useTema.js` (aplica y guarda el tema) |
| `onMounted` | `App.vue` (despacha `libros/cargar`) e `InicioView.vue` |
| `defineProps` / `defineEmits` | `Libro.vue`, `LibroFiltro.vue`, `LibroFormulario.vue`, `AppHeader.vue`, `DetalleLibro.vue` |
| `useStore()` (Vuex) | `App.vue`, `AppHeader.vue` y todas las vistas |
| `useRoute()` / `useRouter()` | `NotFound.vue` |
| Composable propio | [src/composables/useTema.js](./src/composables/useTema.js): `useTema()` devuelve un `ref` `oscuro` compartido por toda la app |

### Componentes reutilizables (`src/components/`)

| Componente | Props que recibe | Eventos que emite | Responsabilidad |
|---|---|---|---|
| `AppHeader.vue` | — | `ayuda` | Marca, navegación con contador de favoritos (`el-badge`), switch de tema claro/oscuro (`useTema`) y botón "Ayuda inicial" (`@click.once`). |
| `AppFooter.vue` | — | — | Pie de página. |
| `Libro.vue` | `libro` (objeto), `mostrarBotonEliminar` (bool), `esFavorito` (bool) | `eliminar`, `alternar-favorito` (id del libro) | Tarjeta (`el-card`) con título, autor, categoría · tipo, año y descripción; botón de favorito y confirmación (`el-popconfirm`) antes de eliminar. Cumple el rol de `<ProductCard>` de la consigna. |
| `LibroFormulario.vue` | — | `agregar-libro` (datos del nuevo libro) | Formulario completo: título, autor, categoría, tipo (dependiente de la categoría), año opcional y descripción opcional. Valida y muestra vista previa en vivo. |
| `LibroFiltro.vue` | `filtros` (objeto `{ autor, categoria, soloFavoritos }`) | `actualizar:filtros` (nuevo objeto de filtros) | Campos de filtro por autor, categoría y "solo favoritos". Nunca modifica la prop directamente: emite el nuevo valor y el padre decide qué hacer con él. |

Los componentes de libros (`Libro`, `LibroFormulario`, `LibroFiltro`) **nunca
mutan sus props ni conocen a Vuex**; toda comunicación hacia el padre se hace con
eventos personalizados (`emit`), y es la vista contenedora (`ListaLibros.vue`)
quien decide cómo actualizar el estado despachando la acción correspondiente
(`libros/agregar`, `libros/eliminar`, `filtros/actualizar`,
`favoritos/alternar`). La única excepción es `AppHeader.vue`, que lee el
getter `favoritos/total` porque es parte del layout y no se reutiliza.

En `/libros`, `ListaLibros.vue` cumple el rol de `<ProductList>`: recorre el
getter `libros/filtrados` y muestra `el-skeleton` mientras carga, `el-alert`
con botón "Reintentar" si la API falla y `el-empty` cuando no hay resultados.

### Vistas (`src/views/`) y rutas

[src/router/index.js](./src/router/index.js) define las rutas de la app:

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | `InicioView.vue` | Bienvenida + dashboard de indicadores de gestión. |
| `/libros` | `ListaLibros.vue` | Formulario para agregar, filtro, listado y eliminación. |
| `/libros/:id` | `DetalleLibro.vue` | Detalle de un libro puntual, con `props: true` para recibir el `id` como prop en vez de leerlo manualmente desde `$route`. |
| `/:pathMatch(.*)*` | `NotFound.vue` | **Página 404.** Ruta comodín (va al final) para cualquier URL que no exista; muestra la ruta pedida (`useRoute().fullPath`) y botones para volver al inicio o al catálogo. |

`DetalleLibro.vue` busca el libro correspondiente en el store y, si no existe,
muestra un mensaje claro (`el-result`) junto con un botón para volver al
listado. Toda la navegación usa `<router-link>` (con `custom` + `navigate`
cuando el destino es un `el-button`) o `useRouter().push`, manteniendo el comportamiento SPA (sin recargas
de página).

### `App.vue` — layout raíz

Compone `<AppHeader>`, el `<router-view />` donde se renderiza cada vista y
`<AppFooter>`. Cuando `AppHeader` emite `ayuda` (botón con `@click.once`),
muestra un mensaje de bienvenida (`el-alert`) solo la primera vez. En
`onMounted` despacha `libros/cargar`.

## Persistencia de datos — Vuex + Axios + json-server

El catálogo ya no vive en un arreglo en memoria: se persiste en
[db.json](./db.json) y se sirve mediante una API REST simulada
(`json-server`), consumida a través de Vuex y Axios. El flujo completo:

1. **`db.json`** (raíz del proyecto) — la "base de datos". Contiene un único
   recurso, `libros`, con los 5 libros de ejemplo. `npm run mock` levanta
   `json-server --port 3001 db.json`, que expone automáticamente:

   | Método | Ruta | Uso |
   |---|---|---|
   | `GET` | `/libros` | Cargar el catálogo completo |
   | `POST` | `/libros` | Crear un libro (el id lo asigna el propio json-server) |
   | `PUT` | `/libros/:id` | Editar un libro existente |
   | `DELETE` | `/libros/:id` | Eliminar un libro |

   > La versión de `json-server` usada (`1.x`) asigna IDs como **strings**
   > (`"1"`, `"aB3xZ..."`), no números autoincrementales. Por eso las
   > comparaciones de id en el store usan `String(a) === String(b)` en vez de
   > `===` directo, para que siempre funcionen sin importar el tipo.

2. **[src/api/index.js](./src/api/index.js)** — instancia de Axios con el
   `baseURL` (`http://localhost:3001`) centralizado en un único lugar. Ningún
   otro archivo del proyecto importa `axios` directamente ni repite esa URL.

3. **[src/store/modules/libros.js](./src/store/modules/libros.js)** — módulo
   Vuex `namespaced: true` que es el único que importa `api`. Sus `actions`
   son `async`/`await` y siempre pasan por `try/catch` + los flags
   `loading`/`error` del estado, para que la interfaz pueda mostrar "Cargando…"
   o un mensaje de error si `npm run mock` no está corriendo.

4. **[src/store/index.js](./src/store/index.js)** — `crearStore()` arma el
   store con los módulos `libros`, `filtros` y `favoritos` y exporta por
   defecto una instancia. Las pruebas usan la fábrica para tener un store
   limpio por caso.

5. **[src/main.js](./src/main.js)** — registra el store con `.use(store)`,
   igual que se hace con el router.

6. **[App.vue](./src/App.vue)** — despacha `store.dispatch('libros/cargar')` una
   sola vez en su hook `onMounted`, al montar la aplicación completa. Así el
   catálogo se pide **una única vez** sin importar por qué ruta entra el
   usuario (`/`, `/libros` o `/libros/:id`), y de ahí en adelante todas las
   vistas leen el mismo estado ya cargado.

7. **Las vistas leen y despachan, nunca acceden a `axios` directamente:**
   - Todas obtienen el store con `useStore()` y leen los getters con
     `computed(() => store.getters['libros/…'])`. `InicioView.vue` lee
     `items`; `ListaLibros.vue` lee `filtrados`.
   - `ListaLibros.vue` despacha `libros/agregar` y `libros/eliminar` al
     recibir los eventos `agregar-libro` y `eliminar` de sus componentes
     hijos, y muestra un `ElMessage` de éxito o error.
   - `DetalleLibro.vue` usa el getter parametrizado `porId` (`state => id =>
     state.items.find(...)`) para buscar el libro de la ruta actual.

   Esto mantiene el mismo principio de "componentes tontos" que ya tenía el
   proyecto: `Libro.vue`, `LibroFormulario.vue` y `LibroFiltro.vue` no saben
   que existe Vuex — solo reciben `props` y emiten eventos.

## Estado global — módulos Vuex

| Módulo | State | Actions | Getters |
|---|---|---|---|
| [libros](./src/store/modules/libros.js) | `items`, `loading`, `error` | `cargar`, `agregar`, `editar`, `eliminar` (todas contra la API) | `items`, `loading`, `error`, `porId`, **`filtrados`** |
| [filtros](./src/store/modules/filtros.js) | `autor`, `categoria`, `soloFavoritos` | `actualizar`, `limpiar` | `activos` |
| [favoritos](./src/store/modules/favoritos.js) | `ids` | `alternar`, `quitar` | `ids`, `total`, `esFavorito` |

- **`libros/filtrados`** combina los tres módulos: lee los criterios desde
  `rootState.filtros` y consulta `rootGetters['favoritos/esFavorito']` cuando
  está activo "solo favoritos". Las vistas no repiten la lógica de filtrado.
- **Filtros en Vuex:** al estar en el store (y no en la vista), los filtros se
  conservan al ir al detalle de un libro y volver al listado.
- **Persistencia de favoritos:** el plugin `persistirFavoritos` de
  [store/index.js](./src/store/index.js) se suscribe a las mutaciones
  `favoritos/*` y guarda los ids en `localStorage`, sin poner efectos
  secundarios dentro de las mutaciones. Al eliminar un libro, la acción
  `libros/eliminar` despacha `favoritos/quitar` para no dejar ids huérfanos.

## Librería UI y tema claro/oscuro

Se usa **Element Plus**, registrado globalmente en [main.js](./src/main.js) con
el idioma español (`element-plus/es/locale/lang/es`). Componentes usados:
`el-card`, `el-button`, `el-input`, `el-select`, `el-checkbox`, `el-form`,
`el-tag`, `el-badge`, `el-switch`, `el-popconfirm`, `el-alert`,
`el-skeleton`, `el-empty`, `el-result` y `ElMessage`.

- **Tema claro/oscuro:** el composable
  [useTema.js](./src/composables/useTema.js) guarda un `ref` `oscuro` y, con
  un `watch`, agrega o quita la clase `dark` en `<html>`, que activa las
  variables oscuras de Element Plus
  (`element-plus/theme-chalk/dark/css-vars.css`). El valor inicial sale de la
  elección guardada en `localStorage` o, si no hay, de
  `prefers-color-scheme`. `main.js` importa el composable antes de montar la
  app para evitar un parpadeo. El switch está en `AppHeader.vue`.
- **Estilos propios:** [estilos.css](./src/assets/estilos.css) solo define el
  layout (encabezado, grillas, tarjetas) y usa las variables `--el-*` de
  Element Plus en vez de colores fijos, así que todo cambia junto con el tema.
  También redefine `--el-color-primary` con el azul de la marca.
- **Responsive:** grillas con `auto-fill`/`auto-fit` + `minmax()` y un
  breakpoint a 600px que apila el encabezado y los filtros.

## Conceptos de Vue.js demostrados (módulo anterior, por lección)

### Lección 1 — Introducción a Vue.js: dashboard de indicadores

[InicioView.vue](./src/views/InicioView.vue) muestra el nombre de usuario
(`usuario.nombre`) mediante interpolación y un dashboard con 4 indicadores de
gestión para Editorial Nova, calculados con propiedades `computed` a partir del
catálogo real de libros:

- `totalLibros` — cantidad total de libros.
- `librosPorCategoria` — cantidad agrupada por `Ficción` / `No Ficción` / `Técnico`.
- `librosPorTipo` — cantidad agrupada por subtipo (`Novela`, `Ensayo`, `Manual`, etc.).
- `promedioLibrosPorCategoria` — total de libros dividido por la cantidad de categorías.

Al agregar o eliminar un libro desde `/libros`, estos indicadores se recalculan
solos porque `InicioView` lee el mismo estado de Vuex (`useStore()` + `computed`)
que usa `ListaLibros` — ambos apuntan al mismo `state.items`, cargado una vez
desde la API simulada.

> **Nota:** la especificación original de este módulo pedía además un contador
> reactivo genérico con botones +/-/reiniciar. Se reemplazó intencionalmente
> por los indicadores de negocio (a pedido explícito durante el desarrollo), ya
> que `totalLibros` cumple el mismo rol pedagógico (un número que sube y baja
> reactivamente) pero con datos reales del catálogo en vez de un valor
> arbitrario.

### Lección 2 — Templates y rendering

- `Libro.vue` es el componente reutilizable que recibe un libro completo
  mediante `props` y muestra título, autor, categoría, tipo y descripción.
- **v-bind:** se usa en su forma explícita (no la abreviada `:`) para clases
  dinámicas y atributos de datos en `Libro.vue`, y para el `model-value` de
  los campos de `LibroFiltro.vue`.
- **v-for:** el listado se recorre con `v-for="libro in libros"`
  usando `libro.id` como `key`.
- **v-if / v-else:** controla la descripción del libro cuando falta, el estado
  encontrado/no encontrado en `DetalleLibro.vue`, y los estados cargando /
  error / vacío del listado.
- **v-show:** se usa en el panel de vista previa del formulario, en el mensaje
  de bienvenida de `App.vue` (mostrado con `.once`) y en el botón "Limpiar
  filtros".

### Lección 3 — Formulario reactivo

`LibroFormulario.vue` contiene input de título, input de autor, select de
categoría, select de tipo (dependiente de la categoría elegida, según
`TIPOS_POR_CATEGORIA`), input opcional de año de publicación y textarea de
descripción, todos conectados con `v-model` a un objeto `nuevoLibro` creado con `reactive()`.
La vista previa se actualiza automáticamente mientras el usuario escribe,
mostrando valores alternativos ("Sin título", "Autor no especificado", etc.)
cuando un campo está vacío. La validación impide agregar un libro si falta
título, autor, categoría o tipo, mostrando mensajes claros por campo.

### Lección 4 — Manejo de eventos

- `@click` en múltiples botones (agregar, eliminar, alternar vista previa,
  limpiar filtros).
- `@submit.prevent` en el formulario evita la recarga de página al enviarlo.
- `@keydown.enter.prevent` junto con `@keyup.enter` en los campos de título y
  autor permite agregar un libro presionando Enter, sin que el navegador
  dispare además el envío nativo del formulario (lo que provocaría una
  duplicación accidental del libro).
- `.once` se usa en el botón "Ayuda inicial" de `AppHeader.vue`: solo la
  primera vez que se presiona se muestra el mensaje de bienvenida.
- La eliminación pide confirmación (`el-popconfirm`) y despacha la acción
  `libros/eliminar`.

### Lección 5 — Vue Router

Ver tabla de rutas más arriba. Rutas dinámicas con `props: true`, navegación
100% SPA, manejo explícito de IDs inexistentes en `DetalleLibro.vue` y página
404 (`NotFound.vue`) para cualquier otra URL.

## Decisiones técnicas

- **Arquitectura modular:** cada responsabilidad vive en su propio archivo
  (componentes de presentación en `components/`, pantallas en `views/`, estado
  en `store/`, configuración de rutas en `router/`), lo que facilita reutilizar
  `Libro.vue`, `LibroFormulario.vue` y `LibroFiltro.vue` desde distintas vistas
  si el proyecto creciera.
- **Composition API con `<script setup>`:** permite agrupar por funcionalidad
  (estado, derivados y acciones juntos) en vez de repartir la lógica entre
  `data`, `computed` y `methods`, y extraer lógica reutilizable a
  composables como `useTema()`. Con Vuex se usa `useStore()`, la forma
  recomendada en Composition API (los helpers `mapGetters`/`mapActions`
  dependen de `this` y son propios de Options API).
- **Gestión del estado:** Vuex 4, con tres módulos namespaced (`libros`,
  `filtros`, `favoritos`; ver [Estado global](#estado-global--módulos-vuex)). Se eligió
  Vuex en vez del módulo reactivo simple usado en una etapa anterior del
  proyecto porque el catálogo pasó a persistirse en una API real
  (`json-server`) en lugar de vivir solo en memoria: Vuex separa con claridad
  el estado (`state`), las mutaciones síncronas (`mutations`) y los efectos
  asíncronos contra la API (`actions`), algo que un simple `reactive()` no
  modela de forma tan explícita. Ver
  [Persistencia de datos](#persistencia-de-datos--vuex--axios--json-server)
  para el detalle completo.
- **Comunicación entre componentes:** los hijos reciben datos únicamente
  mediante `props` (`defineProps`) y nunca los modifican directamente; para
  comunicar acciones hacia el padre usan eventos personalizados (`defineEmits`), por ejemplo `eliminar`
  en `Libro.vue` o `agregar-libro` en `LibroFormulario.vue`.
- **Por qué Vue CLI y no Vite:** el proyecto exige explícitamente una
  configuración basada en Vue CLI. El build se gestiona con `@vue/cli-service`
  (scripts `vue-cli-service serve` / `build` / `test:unit`) junto a los
  plugins oficiales `@vue/cli-plugin-babel`, `@vue/cli-plugin-router`,
  `@vue/cli-plugin-vuex` y `@vue/cli-plugin-unit-jest`. No hay
  `webpack.config.js`. Los ajustes propios (puerto, título de la página)
  viven en `vue.config.js` mediante `defineConfig`, sin depender del
  ecosistema Vite en ningún punto (no se usa `vite.config.js` ni
  `import.meta.env`; el router usa `process.env.BASE_URL`, propio de Vue CLI).
- **Uso de `.browserslistrc`:** define el rango de navegadores objetivo
  (`> 0.5%`, `last 2 versions`, `not dead`, `not IE 11`). `babel.config.js`
  usa `@vue/cli-plugin-babel/preset` (basado en `@babel/preset-env`), que lee automáticamente este archivo para decidir
  qué transformaciones de sintaxis aplicar, evitando duplicar esa
  configuración en `package.json` o en herramientas específicas de Vite.
- **Por qué Element Plus (y no Vuetify):** Element Plus se registra con un solo
  `app.use()` y funciona con Vue CLI/Webpack sin plugins de compilación
  adicionales (Vuetify 3 recomienda `webpack-plugin-vuetify`). Además trae
  modo oscuro por variables CSS, que cubre el requisito de tema claro/oscuro
  sin duplicar estilos. Se importa completo por simplicidad (`chunk-vendors`
  pesa ~380 KiB gzip); si hiciera falta optimizar, el siguiente paso sería
  importar solo los componentes usados con `unplugin-vue-components`.
- **Por qué no se migró a Nuxt ni Quasar (opcional en la consigna):** la app es
  una SPA de catálogo sin necesidad de SEO ni render en servidor (lo que
  justificaría Nuxt) y no hay un requisito concreto de publicarla como app
  móvil o de escritorio (lo que justificaría Quasar). Migrar habría reemplazado
  Vue CLI, que la consigna pide explícitamente. Si más adelante se quisiera
  empaquetar para móvil/escritorio, Quasar sería la opción natural porque
  reutiliza los mismos componentes `.vue` y Vuex.
- **Pruebas:** Jest se integra con `@vue/cli-plugin-unit-jest` (preset oficial
  de Vue CLI). `jest.config.js` amplía `transformIgnorePatterns` para
  transformar `@vueuse`, dependencia de Element Plus que solo se publica como
  ES modules. Para e2e se eligió Cypress con `start-server-and-test` y
  `cy.intercept`, de modo que la prueba es repetible y no depende de
  `db.json` ni de `json-server`.
