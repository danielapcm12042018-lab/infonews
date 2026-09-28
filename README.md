# InfoNews

Plataforma web de noticias tipo periódico, desarrollada como entrega del módulo de Front-end.

## Tecnologías

- HTML5
- CSS3
- JavaScript (vanilla, sin frameworks ni librerías)
- JSON local (archivo `assets/data/noticias.json`)
- localStorage (para favoritos y datos del usuario)

## Páginas

- **Inicio** (`index.html`): muestra las noticias destacadas y un resumen del portal.
- **Noticias** (`pages/noticias.html`): listado de todas las noticias con buscador y filtro por categoría.
- **Detalle** (`pages/detalle.html`): muestra el contenido completo de una noticia a partir de su identificador en la URL.
- **Favoritos** (`pages/favoritos.html`): guarda y muestra las noticias marcadas como favoritas por el usuario.
- **Gestionar** (`pages/gestionar.html`): permite crear y eliminar noticias.
- **Contacto** (`pages/contacto.html`): formulario de contacto con validación de los campos.

## Cómo ejecutar el proyecto

El proyecto usa `fetch` para leer el archivo `noticias.json`, por eso **no se debe abrir con doble clic** sobre `index.html`: al abrirlo con `file://` el navegador bloquea las peticiones y el sitio se queda sin datos.

Opción recomendada: **Live Server de VS Code**

1. Instala la extensión *Live Server* en VS Code.
2. Abre la carpeta del proyecto en VS Code.
3. Haz clic derecho sobre `index.html` y elige **Open with Live Server**.

Alternativa con Python (abre http://localhost:8000):

```
python -m http.server 8000
```

## Estructura de carpetas

```
InfoNews/
├── index.html
├── README.md
├── .gitignore
├── pages/
│   ├── noticias.html
│   ├── detalle.html
│   ├── favoritos.html
│   ├── gestionar.html
│   └── contacto.html
└── assets/
    ├── css/
    │   ├── base.css
    │   ├── layout.css
    │   ├── components.css
    │   └── pages/
    │       ├── home.css
    │       ├── noticias.css
    │       ├── detalle.css
    │       ├── favoritos.css
    │       ├── gestionar.css
    │       └── contacto.css
    ├── js/
    │   ├── main.js
    │   ├── components.js
    │   ├── storage.js
    │   ├── data.js
    │   ├── render.js
    │   ├── validators.js
    │   └── pages/
    │       ├── home.js
    │       ├── noticias.js
    │       ├── detalle.js
    │       ├── favoritos.js
    │       ├── gestionar.js
    │       └── contacto.js
    ├── data/
    │   └── noticias.json
    └── img/
        └── .gitkeep
```

## Enlaces

URL del repositorio:

URL del despliegue:

## Autor

Nombre:
