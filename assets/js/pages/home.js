/**
 * home.js
 * Llena las secciones de index.html con las noticias del JSON.
 * Usa las funciones de data.js y render.js, aqui no se reescribe ninguna.
 */

// El Home (index.html) esta en la raiz del proyecto, asi que la ruta base es ""
const rutaBase = "";

/**
 * mostrarBarraCategorias()
 * Escribe un enlace por cada categoria dentro de la barra de categorias.
 * Cada enlace lleva a la pagina de noticias filtrada por esa categoria.
 * El texto se escribe tal cual, el CSS lo pondra en mayusculas.
 */
function mostrarBarraCategorias() {
    var contenedor = document.getElementById("barra-categorias");

    // Si el elemento no existe en esta pagina, no hacemos nada
    if (contenedor === null) {
        return;
    }

    var categorias = obtenerCategorias();
    var html = "";

    // Un <a> por cada categoria
    for (var i = 0; i < categorias.length; i++) {
        // encodeURIComponent() deja el nombre seguro dentro de la URL
        html += `
            <a href="pages/noticias.html?categoria=${encodeURIComponent(categorias[i])}">${categorias[i]}</a>
        `;
    }

    contenedor.innerHTML = html;
}

/**
 * mostrarPortada()
 * Muestra en la portada la noticia con id 2, que es la que abre al entrar.
 * Si esa noticia no existe, no hace nada.
 */
function mostrarPortada() {
    var contenedor = document.getElementById("portada-principal");

    if (contenedor === null) {
        return;
    }

    // Buscamos la noticia principal por su id
    var noticia = buscarNoticiaPorId(2);

    // Si no la encontramos, dejamos el contenedor vacio
    if (noticia === null) {
        return;
    }

    var urlImagen = rutaBase + "assets/img/" + noticia.imagen;
    var urlDetalle = rutaBase + "pages/detalle.html?id=" + noticia.id;

    contenedor.innerHTML = `
        <!-- Imagen con la categoria encima -->
        <div class="portada-imagen">
            <img src="${urlImagen}" alt="${noticia.titulo}">
            <span class="badge">${noticia.categoria}</span>
        </div>

        <h2 class="portada-titulo">
            <a href="${urlDetalle}">${noticia.titulo}</a>
        </h2>

        <p class="portada-subtitulo">${noticia.subtitulo}</p>

        <!-- Autor y fecha -->
        <p class="portada-meta">Por ${noticia.autor} | ${formatearFecha(noticia.fecha)}</p>
    `;
}

/**
 * mostrarMasLeidos()
 * Llena la lista "Lo mas leido" con las 4 noticias mas visitadas.
 * El numero de posicion empieza en 1.
 */
function mostrarMasLeidos() {
    var contenedor = document.getElementById("lista-mas-leidos");

    if (contenedor === null) {
        return;
    }

    var masLeidas = obtenerMasLeidas(4);
    var html = "";

    for (var i = 0; i < masLeidas.length; i++) {
        // Le sumamos 1 porque las posiciones empiezan en 1, no en 0
        html += crearItemMasLeido(masLeidas[i], i + 1, rutaBase);
    }

    contenedor.innerHTML = html;
}

/**
 * crearCardDestacado(noticia, horas)
 * Devuelve el HTML de una tarjeta de la seccion "Destacados de hoy".
 * horas indica cuantas horas lleva publicada la noticia.
 * Solo devuelve texto HTML, no escribe en la pagina.
 */
function crearCardDestacado(noticia, horas) {
    var urlImagen = rutaBase + "assets/img/" + noticia.imagen;
    var urlDetalle = rutaBase + "pages/detalle.html?id=" + noticia.id;

    return `
        <article class="card-destacado">
            <!-- Imagen con la categoria encima -->
            <div class="card-destacado-imagen">
                <img src="${urlImagen}" alt="${noticia.titulo}">
                <span class="badge">${noticia.categoria}</span>
            </div>

            <h3 class="card-destacado-titulo">
                <a href="${urlDetalle}">${noticia.titulo}</a>
            </h3>

            <p class="card-hora">Hace ${horas} horas</p>
        </article>
    `;
}

/**
 * mostrarDestacados()
 * Muestra las noticias destacadas en "Destacados de hoy".
 * Quitamos la noticia con id 2 porque esa ya esta en la portada,
 * y nos quedamos solo con las 3 primeras.
 */
function mostrarDestacados() {
    var contenedor = document.getElementById("destacados-hoy");

    if (contenedor === null) {
        return;
    }

    // Todas las destacadas menos la que ya sale en la portada
    var destacadas = obtenerDestacadas().filter(function (noticia) {
        return noticia.id !== 2;
    });

    // Nos quedamos con las 3 primeras
    destacadas = destacadas.slice(0, 3);

    // Horas que ponemos a cada tarjeta segun su posicion
    var horas = [2, 4, 6];

    var html = "";
    for (var i = 0; i < destacadas.length; i++) {
        html += crearCardDestacado(destacadas[i], horas[i]);
    }

    contenedor.innerHTML = html;
}

/**
 * mostrarUltimas()
 * Muestra en "Ultimas noticias" las noticias recientes que no son destacadas.
 * Dejamos la lista completa y la pintamos con mostrarCards() de render.js.
 */
function mostrarUltimas() {
    // mostrarCards() ya busca el contenedor y avisa si la lista esta vacia
    var ultimas = obtenerUltimas(12).filter(function (noticia) {
        return noticia.destacada === false;
    });

    ultimas = ultimas.slice(0, 3);

    mostrarCards(ultimas, "ultimas-noticias", rutaBase);
}

/**
 * mostrarCategorias()
 * Muestra una tarjeta por cada categoria con cuantas noticias tiene.
 * El numero de articulos va en el texto, usando "articulo" en singular.
 */
function mostrarCategorias() {
    var contenedor = document.getElementById("grilla-categorias");

    if (contenedor === null) {
        return;
    }

    // La lista con el numero de articulos viene en el JSON, en categoriasExplorar
    var categorias = datosNoticias.categoriasExplorar;

    // Si el JSON no trae esa lista, no pintamos nada
    if (categorias === undefined || categorias === null) {
        return;
    }

    var html = "";

    for (var i = 0; i < categorias.length; i++) {
        var total = categorias[i].articulos;

        // Si solo hay una, usamos el singular
        var textoArticulos = total === 1 ? "1 artículo" : total + " artículos";

        html += `
            <a class="card-categoria" href="pages/noticias.html?categoria=${encodeURIComponent(categorias[i].nombre)}">
                <h3>${categorias[i].nombre}</h3>
                <p>${textoArticulos}</p>
            </a>
        `;
    }

    contenedor.innerHTML = html;
}

/**
 * init()
 * Espera a que se carguen los datos y despues llena todas las secciones del Home.
 * Se usa then() porque cargarDatos() devuelve una promesa.
 */
function init() {
    cargarDatos(rutaBase).then(function () {
        mostrarBarraCategorias();
        mostrarPortada();
        mostrarMasLeidos();
        mostrarDestacados();
        mostrarUltimas();
        mostrarCategorias();

        // Las cards se pintan con JavaScript, asi que las marcamos al final
        marcarFavoritosGuardados();
    });
}

// Llamamos a init() para que todo empiece al cargar la pagina
init();
