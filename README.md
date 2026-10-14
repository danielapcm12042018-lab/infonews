# InfoNews — Plataforma Web de Noticias

InfoNews es una plataforma web de noticias desarrollada con Angular. Permite
consultar un catálogo de artículos, filtrarlos y buscarlos, leer su detalle,
guardarlos como favoritos y crear o eliminar noticias (mini CRUD). Los datos se
sirven desde archivos JSON locales y los cambios del usuario se guardan en el
navegador con `localStorage`, por lo que **no necesita backend**.

Este repositorio corresponde a la entrega final de Front-end. La versión
original de la Entrega 2 (HTML, CSS y JavaScript sin frameworks) se conserva en
la carpeta [`legacy/`](./legacy) como referencia.

## Tecnologías usadas

- **Angular 22** (componentes standalone, routing y formularios).
- **TypeScript 6**.
- **HTML5** y **CSS3** (variables CSS, grid, flexbox y diseño responsive).
- **RxJS** y **Angular Signals** para el estado reactivo.
- **Angular HttpClient** para cargar los datos.
- **JSON local** como fuente de datos (`public/assets/data`).
- **localStorage** para persistir favoritos, noticias creadas/eliminadas y
  mensajes de contacto.
- **Vitest** como ejecutor de pruebas unitarias.
- **Prettier** para el formateo del código.
- **Sharp** para optimizar las imágenes.

## Funcionalidades

Las funcionalidades cubren los requisitos de la entrega:

1. **Tarjetas de noticia**: cada tarjeta (`NoticiaCardComponent`) muestra imagen,
   categoría, título, descripción breve y un botón/enlace "Ver más" que abre el
   detalle.
2. **Detalle de noticia**: página con la información completa (autor, fecha,
   visitas, tiempo de lectura, cuerpo, cita, puntos clave y etiquetas), imagen
   principal y botones de **favoritos** y **contactar**.
3. **Favoritos**: se guardan por `id` en `localStorage` y se muestran en una
   lista personalizada; también se pueden vaciar.
4. **Home**: cabecera con menú de 5 páginas, bienvenida, noticias destacadas,
   llamadas a la acción (CTA), testimonios, bloque de contacto y pie de página.
5. **Contacto**: formulario con validaciones (nombre, correo, asunto y mensaje)
   y mensaje de confirmación visible al enviar.
6. **Mini CRUD**: en "Gestionar" se pueden **crear** noticias con un formulario
   reactivo y **eliminarlas**, además de restablecer los datos originales.

Además, el catálogo permite **filtrar por categoría** y **buscar por texto**
(título, descripción o etiquetas), con el estado guardado en la URL para que los
enlaces sean compartibles.

## Cómo ejecutarlo

Requisitos: Node.js y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo (http://localhost:4200)
npm start

# 3. Compilar para producción (dist/)
npm run build

# 4. Ejecutar las pruebas unitarias
npm test

# 5. Optimizar las imágenes de public/assets/img (opcional)
npm run optimizar:img
```

## Estructura de carpetas

```text
src/
  app/
    components/          Componentes reutilizables
      aviso/             Toast global (avisos)
      footer/            Pie de página
      header/            Cabecera con menú y buscador
      noticia-card/      Tarjeta de noticia reutilizable
    pages/               Páginas asociadas a cada ruta (lazy)
      contacto/          Formulario de contacto
      favoritos/         Lista de favoritos
      gestionar/         Mini CRUD (crear y eliminar)
      home/              Página de inicio
      no-encontrado/     Página 404
      noticia-detalle/   Detalle de una noticia
      noticias-lista/    Listado con filtros y buscador
    models/              Interfaces de datos (noticia, contacto, testimonio)
    pipes/               Pipe propio de orden por fecha
    services/            Servicios (noticias, favoritos, contacto, testimonios, avisos)
    app.config.ts        Configuración de la aplicación (router, HttpClient, locale)
    app.routes.ts        Rutas de la aplicación
    app.ts / app.html    Componente raíz
  styles.css             Estilos globales (variables, layout, componentes comunes)
  index.html             Página HTML base

public/
  assets/
    data/                noticias.json, contacto.json, testimonios.json
    img/                 Imágenes (.jpg) usadas por las noticias

legacy/                  Versión de la Entrega 2 (HTML/CSS/JS sin framework)
scripts/                 Script de optimización de imágenes
```

## Rutas de la aplicación

| Ruta            | Página              | Título de pestaña             |
| --------------- | ------------------- | ----------------------------- |
| `/`             | Inicio              | InfoNews · Inicio             |
| `/noticias`     | Listado de noticias | InfoNews · Noticias           |
| `/noticias/:id` | Detalle de noticia  | InfoNews · (título dinámico)  |
| `/favoritos`    | Favoritos           | InfoNews · Favoritos          |
| `/gestionar`    | Gestionar (CRUD)    | InfoNews · Gestionar          |
| `/contacto`     | Contacto            | InfoNews · Contacto           |
| `/**`           | Página no encontrada| InfoNews · Página no encontrada |

El listado acepta los parámetros `?categoria=` y `?q=` (búsqueda). La página de
contacto admite `?asunto=`, que se rellena desde el botón "Contactar" del
detalle.

## Dónde se usa cada concepto de Angular

- **Componentes**: todos los archivos de `src/app/components` y `src/app/pages`
  son componentes standalone con su decorador `@Component` y lista `imports`.
- **Interpolación** (`{{ }}`): en las plantillas, por ejemplo
  `home.component.html`, `footer.component.html` y
  `noticia-card.component.html`.
- **Property binding** (`[ ]`): `[src]` e `[alt]` de las imágenes,
  `[value]` del buscador, `[class.activo]`, `[attr.aria-*]`, `[routerLink]` y
  `[queryParams]`.
- **Event binding** (`( )`): `(click)` de botones y enlaces, `(input)` del
  buscador y `(ngSubmit)` de los formularios.
- **Control de flujo**: bloques `@if`/`@else` y `@for`/`@empty` en el listado,
  el home, el detalle, gestionar y contacto.
- **Servicios** (con `inject()` y `providedIn: 'root'`):
  - `NoticiasService`: carga el JSON y combina altas y bajas (CRUD).
  - `FavoritosService`: gestiona los favoritos en `localStorage`.
  - `ContactoService`: carga los datos de contacto y guarda los mensajes.
  - `TestimoniosService`: carga los testimonios del home.
  - `AvisosService`: muestra avisos emergentes (toast).
- **Routing**: en `app.routes.ts` con carga perezosa (`loadComponent`),
  `provideRouter`, `withComponentInputBinding` (parámetros de ruta como inputs)
  y `withInMemoryScrolling`. Se usan `RouterLink` y `RouterLinkActive`.
- **Formularios reactivos**: en `gestionar.component.ts` y
  `contacto.component.ts` con `ReactiveFormsModule`, `FormBuilder` y
  `Validators`, mostrando mensajes de error en español.
- **Signals**: `signal`, `computed` y `input` en servicios y páginas para el
  estado reactivo, y `effect` para el título dinámico del detalle.
- **Pipes**: `DatePipe`, `DecimalPipe` y `UpperCasePipe` en el detalle, además
  del pipe propio `ordenarPorFecha`.
- **Peticiones HTTP**: `HttpClient` (`provideHttpClient`) para leer los JSON de
  `public/assets/data`.
- **Accesibilidad**: enlace "Saltar al contenido", foco visible, atributos
  `aria-*`, textos alternativos en las imágenes y navegación por teclado.

## Despliegue

- URL del despliegue: [URL DEL DESPLIEGUE]
- URL del vídeo: [URL DEL VIDEO]

## Autor

[TU NOMBRE]
