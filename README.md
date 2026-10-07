# BookList SPA

## Descripción

BookList es una aplicación de página única (SPA) construida con Vue.js que permite
gestionar el catálogo de libros de **Editorial Nova**: agregar libros mediante un
formulario reactivo, visualizarlos en un listado, filtrarlos por autor o categoría,
eliminarlos, consultar el detalle individual de cada uno a través de una ruta
dinámica, y monitorear el catálogo mediante un dashboard de indicadores en tiempo
real.

El proyecto fue desarrollado como trabajo académico para demostrar el uso de
componentes, reactividad, directivas, formularios con `v-model`, manejo de eventos
y Vue Router, siguiendo el patrón **MVVM**.

## Funcionalidades

- Pantalla de inicio con dashboard de indicadores de gestión (total de libros, por
  categoría, por tipo y promedio por categoría), calculados en tiempo real.
- Listado de libros con tarjetas reutilizables.
- Agregar libros mediante formulario con selects dependientes (categoría → tipo) y
  vista previa en tiempo real.
- Validación de campos obligatorios (título, autor, categoría, tipo).
- Filtrar libros por autor y por categoría.
- Eliminar libros con confirmación.
- Ver el detalle individual de cada libro mediante rutas dinámicas (`/libros/:id`).
- Navegación 100% SPA con Vue Router (sin recargas de página).
- Manejo correcto de identificadores de libro inexistentes.

## Tecnologías

- Vue.js 3
- Vue Router 4
- Vuex 4 (estado global, módulo namespaced `libros`)
- Axios (cliente HTTP centralizado)
- json-server (API REST simulada para persistencia local)
- JavaScript (ES2015+)
- CSS puro
- Vue CLI 5 (`@vue/cli-service`, basado en Webpack 5)

**Este proyecto no utiliza Vite.** La compilación se realiza con Vue CLI
(`vue-cli-service`, que usa Webpack internamente) y la compatibilidad de
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
`js/app.[hash].js` + `js/chunk-vendors.[hash].js` + `css/app.[hash].css`). Al abrirlos, la app sigue necesitando la API
simulada corriendo en `http://localhost:3001` (`npm run mock`), ya que el
catálogo de libros se obtiene por HTTP y no queda embebido en el bundle.

## Estructura del proyecto

```text
booklist-spa/
├── public/
│   └── index.html                # Plantilla HTML base (un solo <div id="app">)
├── src/
│   ├── api/
│   │   └── index.js              # Instancia de Axios (baseURL de json-server)
│   ├── assets/
│   │   └── estilos.css           # Estilos globales (un solo sistema de diseño)
│   ├── components/
│   │   ├── Libro.vue             # Tarjeta reutilizable de un libro
│   │   ├── LibroFormulario.vue   # Formulario para agregar libros
│   │   └── LibroFiltro.vue       # Filtro por autor y categoría
│   ├── router/
│   │   └── index.js              # Definición de rutas (Vue Router)
│   ├── store/
│   │   ├── index.js              # createStore(): une los módulos Vuex
│   │   └── modules/
│   │       └── libros.js         # Módulo Vuex namespaced (Model + acceso a la API)
│   ├── views/
│   │   ├── InicioView.vue        # "/" — dashboard de indicadores
│   │   ├── ListaLibros.vue       # "/libros" — gestión del catálogo
│   │   └── DetalleLibro.vue      # "/libros/:id" — detalle de un libro
│   ├── App.vue                   # Layout raíz: navegación + <router-view>
│   └── main.js                   # Punto de entrada, monta app + router + store
├── db.json                       # Base de datos simulada (json-server)
├── .browserslistrc
├── babel.config.js
├── vue.config.js                 # Configuración de Vue CLI
├── package.json
└── README.md
```

## Cómo se construyó — componentes y arquitectura

El proyecto sigue el patrón **MVVM**, apoyado en una arquitectura modular (en vez
de un único archivo monolítico) para mantener responsabilidades separadas:

- **Model** — el estado vive en un módulo Vuex namespaced:
  [src/store/modules/libros.js](./src/store/modules/libros.js). Ahí se define
  el `state` (`items`, `loading`, `error`), las `mutations` que lo modifican
  (`SET_ITEMS`, `AGREGAR`, `EDITAR`, `ELIMINAR`, `SET_LOADING`, `SET_ERROR`),
  las `actions` asíncronas que hablan con la API (`cargar`, `agregar`,
  `editar`, `eliminar`) y los `getters` que exponen el estado de forma
  derivada (`items`, `loading`, `error`, `porId`). También exporta las
  constantes `CATEGORIAS` (`Ficción`, `No Ficción`, `Técnico`) y
  `TIPOS_POR_CATEGORIA` (el subtipo específico dentro de cada categoría, p. ej.
  `Novela`, `Ensayo`, `Manual`) — son configuración fija, no vienen de la API.
  Cada libro tiene: `id`, `titulo`, `autor`, `categoria`, `tipo`, `descripcion`
  y `fechaPublicacion`.

  Como el estado vive en un único store Vuex compartido, todas las vistas que
  lo consultan (`useGetters`/`mapGetters`) quedan sincronizadas
  automáticamente entre sí — se mantiene consistente al navegar entre `/`,
  `/libros` y `/libros/:id`, sin volver a pedir los datos a la API en cada
  vista. Ver la sección [Persistencia de datos](#persistencia-de-datos--vuex--axios--json-server)
  más abajo para el detalle de cómo se conecta con el backend simulado.

- **View** — el `<template>` de cada componente `.vue`.

- **ViewModel** — los `methods` y `computed` de cada componente (por ejemplo
  `librosFiltrados` en `ListaLibros.vue`, o los indicadores del dashboard en
  `InicioView.vue`), que conectan el modelo con la vista sin lógica compleja
  embebida en el template.

### Componentes reutilizables (`src/components/`)

| Componente | Props que recibe | Eventos que emite | Responsabilidad |
|---|---|---|---|
| `Libro.vue` | `libro` (objeto), `mostrarBotonEliminar` (bool) | `eliminar` (id del libro) | Muestra una tarjeta con título, autor, categoría · tipo, año y descripción; pide confirmación antes de eliminar. |
| `LibroFormulario.vue` | — | `agregar-libro` (datos del nuevo libro) | Formulario completo: título, autor, categoría, tipo (dependiente de la categoría), año opcional y descripción opcional. Valida y muestra vista previa en vivo. |
| `LibroFiltro.vue` | `filtros` (objeto `{ autor, categoria }`) | `actualizar:filtros` (nuevo objeto de filtros) | Campos de filtro por autor y categoría. Nunca modifica la prop directamente: emite el nuevo valor y el padre decide qué hacer con él. |

Los componentes hijos **nunca mutan sus props ni conocen a Vuex**; toda
comunicación hacia el padre se hace con eventos personalizados (`$emit`), y es
la vista contenedora (`ListaLibros.vue`) quien decide cómo actualizar el
estado despachando la acción correspondiente (`dispatch('libros/agregar', …)`,
`dispatch('libros/eliminar', …)`).

### Vistas (`src/views/`) y rutas

[src/router/index.js](./src/router/index.js) define las tres rutas requeridas:

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | `InicioView.vue` | Bienvenida + dashboard de indicadores de gestión. |
| `/libros` | `ListaLibros.vue` | Formulario para agregar, filtro, listado y eliminación. |
| `/libros/:id` | `DetalleLibro.vue` | Detalle de un libro puntual, con `props: true` para recibir el `id` como prop en vez de leerlo manualmente desde `$route`. |

`DetalleLibro.vue` busca el libro correspondiente en el store y, si no existe,
muestra un mensaje claro junto con un enlace para volver al listado. Toda la
navegación usa `<router-link>`, manteniendo el comportamiento SPA (sin recargas
de página).

### `App.vue` — layout raíz

Contiene el encabezado, la navegación principal (`<router-link>` a Inicio y
Libros) y el `<router-view />` donde se renderiza cada vista. También incluye
un botón "Ayuda inicial" con el modificador `@click.once`, que muestra un
mensaje de bienvenida únicamente la primera vez que se presiona.

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

4. **[src/store/index.js](./src/store/index.js)** — `createStore({ modules: { libros } })`.
   Si el proyecto creciera con más recursos (por ejemplo `autores.js`), cada
   uno sería un módulo separado con su propio namespace, igual que `libros.js`.

5. **[src/main.js](./src/main.js)** — registra el store con `.use(store)`,
   igual que se hace con el router.

6. **[App.vue](./src/App.vue)** — despacha `dispatch('libros/cargar')` una
   sola vez en su hook `created()`, al montar la aplicación completa. Así el
   catálogo se pide **una única vez** sin importar por qué ruta entra el
   usuario (`/`, `/libros` o `/libros/:id`), y de ahí en adelante todas las
   vistas leen el mismo estado ya cargado.

7. **Las vistas leen y despachan, nunca acceden a `axios` directamente:**
   - `InicioView.vue` y `ListaLibros.vue` usan `mapGetters('libros', …)` para
     leer `items`, `loading` y `error` como propiedades `computed`.
   - `ListaLibros.vue` usa `mapActions('libros', …)` para exponer `agregar` y
     `eliminar` como `methods`, que llama al recibir los eventos
     `agregar-libro` y `eliminar` de sus componentes hijos.
   - `DetalleLibro.vue` usa el getter parametrizado `porId` (`state => id =>
     state.items.find(...)`) para buscar el libro de la ruta actual.

   Esto mantiene el mismo principio de "componentes tontos" que ya tenía el
   proyecto: `Libro.vue`, `LibroFormulario.vue` y `LibroFiltro.vue` no saben
   que existe Vuex — solo reciben `props` y emiten eventos.

## Conceptos de Vue.js demostrados (por lección)

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
solos porque `InicioView` lee el mismo estado de Vuex (`mapGetters('libros', …)`)
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
  dinámicas y atributos de datos en `Libro.vue`, y para el `value` de los
  campos de `LibroFiltro.vue`.
- **v-for:** el listado se recorre con `v-for="libro in librosFiltrados"`
  usando `libro.id` como `key`.
- **v-if / v-else:** controla la descripción del libro cuando falta, el estado
  encontrado/no encontrado en `DetalleLibro.vue`, y el mensaje "No hay libros
  disponibles." cuando el listado filtrado queda vacío.
- **v-show:** se usa en el panel de vista previa del formulario, en el mensaje
  de bienvenida de `App.vue` (mostrado con `.once`) y en el botón "Limpiar
  filtros".

### Lección 3 — Formulario reactivo

`LibroFormulario.vue` contiene input de título, input de autor, select de
categoría, select de tipo (dependiente de la categoría elegida, según
`TIPOS_POR_CATEGORIA`), input opcional de año de publicación y textarea de
descripción, todos conectados con `v-model` a un objeto `nuevoLibro` reactivo.
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
- `.once` se usa en el botón "Ayuda inicial" de `App.vue`: solo la primera vez
  que se presiona se muestra el mensaje de bienvenida.
- La eliminación se dispara con `@click`, pide confirmación (`window.confirm`)
  y actualiza el arreglo reactivo mediante `splice`.

### Lección 5 — Vue Router

Ver tabla de rutas más arriba. Rutas dinámicas con `props: true`, navegación
100% con `<router-link>`, manejo explícito de IDs inexistentes en
`DetalleLibro.vue`.

## Decisiones técnicas

- **Arquitectura modular:** cada responsabilidad vive en su propio archivo
  (componentes de presentación en `components/`, pantallas en `views/`, estado
  en `store/`, configuración de rutas en `router/`), lo que facilita reutilizar
  `Libro.vue`, `LibroFormulario.vue` y `LibroFiltro.vue` desde distintas vistas
  si el proyecto creciera.
- **Gestión del estado:** Vuex 4, con un único módulo namespaced `libros`
  ([src/store/modules/libros.js](./src/store/modules/libros.js)). Se eligió
  Vuex en vez del módulo reactivo simple usado en una etapa anterior del
  proyecto porque el catálogo pasó a persistirse en una API real
  (`json-server`) en lugar de vivir solo en memoria: Vuex separa con claridad
  el estado (`state`), las mutaciones síncronas (`mutations`) y los efectos
  asíncronos contra la API (`actions`), algo que un simple `reactive()` no
  modela de forma tan explícita. Ver
  [Persistencia de datos](#persistencia-de-datos--vuex--axios--json-server)
  para el detalle completo.
- **Comunicación entre componentes:** los hijos reciben datos únicamente
  mediante `props` y nunca los modifican directamente; para comunicar acciones
  hacia el padre usan eventos personalizados (`$emit`), por ejemplo `eliminar`
  en `Libro.vue` o `agregar-libro` en `LibroFormulario.vue`.
- **Por qué Vue CLI y no Vite:** el proyecto exige explícitamente una
  configuración basada en Vue CLI. El build se gestiona con `@vue/cli-service`
  (scripts `vue-cli-service serve` / `vue-cli-service build`) junto a los
  plugins oficiales `@vue/cli-plugin-babel`, `@vue/cli-plugin-router` y
  `@vue/cli-plugin-vuex`. Los ajustes propios (puerto, título de la página)
  viven en `vue.config.js` mediante `defineConfig`, sin depender del
  ecosistema Vite en ningún punto (no se usa `vite.config.js` ni
  `import.meta.env`; el router usa `process.env.BASE_URL`, propio de Vue CLI).
- **Uso de `.browserslistrc`:** define el rango de navegadores objetivo
  (`> 0.5%`, `last 2 versions`, `not dead`, `not IE 11`). `babel.config.js`
  usa `@vue/cli-plugin-babel/preset` (basado en `@babel/preset-env`), que lee automáticamente este archivo para decidir
  qué transformaciones de sintaxis aplicar, evitando duplicar esa
  configuración en `package.json` o en herramientas específicas de Vite.
