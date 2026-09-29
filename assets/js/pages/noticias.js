/**
 * noticias.js
 * Llena la pagina de listado de noticias: barra de filtros por categoria,
 * buscador, tarjetas y paginacion.
 * Usa las funciones que ya existen en data.js y render.js.
 */

// La pagina esta dentro de pages/, asi que las rutas llevan "../"
const rutaBase = "../";

// Cuantas noticias mostramos en cada pagina del listado
const noticiasPorPagina = 6;

// Estado de la pagina: que filtro y que pagina estamos viendo
let categoriaActual = "Todas";
let textoBusqueda = "";
let paginaActual = 1;

/**
 * leerCategoriaDeLaUrl()
 * Lee el parametro "categoria" de la URL, por ejemplo
 * ?categoria=Política cuando entras desde una tarjeta del Home.
 * Si esa categoria no existe en el JSON, nos quedamos con "Todas".
 */
function leerCategoriaDeLaUrl() {
    // URLSearchParams es la forma facil de leer los parametros de la URL
    var categoriaUrl = new URLSearchParams(window.location.search).get("categoria");

    // Si no hay ninguna en la URL, dejamos el filtro en "Todas"
    if (categoriaUrl === null) {
        categoriaActual = "Todas";
        return;
    }

    // Solo aceptamos categorias que existan de verdad en el JSON
    if (obtenerCategorias().indexOf(categoriaUrl) !== -1) {
        categoriaActual = categoriaUrl;
    } else {
        categoriaActual = "Todas";
    }
}

/**
 * leerBusquedaDeLaUrl()
 * Lee el parametro "buscar" de la URL, por ejemplo
 * ?buscar=oro cuando escribimos algo en el buscador de la cabecera.
 * Si hay texto, lo deja escrito en el buscador de la pagina.
 */
function leerBusquedaDeLaUrl() {
    var textoUrl = new URLSearchParams(window.location.search).get("buscar");

    // Si no hay nada en la URL, no buscamos por texto
    if (textoUrl === null) {
        return;
    }

    textoBusqueda = textoUrl;

    // Escribimos el texto en el buscador de la pagina, si existe
    var campoBuscar = document.getElementById("campo-buscar");

    if (campoBuscar !== null) {
        campoBuscar.value = textoUrl;
    }
}

/**
 * obtenerNoticiasFiltradas()
 * Devuelve las noticias que cumple el filtro de categoria y, si el usuario
 * esta escribiendo en el buscador, tambien la busqueda por texto.
 * Devuelven el resultado ordenado de la fecha mas reciente a la mas antigua.
 */
function obtenerNoticiasFiltradas() {
    // Primero filtramos por la categoria elegida
    var noticias = filtrarPorCategoria(categoriaActual);

    // Si el buscador tiene algo escrito, nos quedamos solo con las coincidencias
    if (textoBusqueda !== "") {
        // buscarPorTexto() devuelve las que coinciden con ese texto
        var coincidencias = buscarPorTexto(textoBusqueda);

        // Comparamos por id porque las noticias son objetos distintos,
        // no se pueden comparar con === directamente
        noticias = noticias.filter(function (noticia) {
            return coincidencias.some(function (otra) {
                return otra.id === noticia.id;
            });
        });
    }

    // slice() copia el array para poder ordenarlo sin tocar el original
    var copia = noticias.slice();

    // Las fechas "AAAA-MM-DD" se pueden comparar como texto.
    // Devolvemos 1 cuando a es mas antigua, asi a queda despues de b
    // y el orden final es de la fecha mas reciente a la mas antigua.
    copia.sort(function (a, b) {
        if (a.fecha < b.fecha) {
            return 1;
        }
        if (a.fecha > b.fecha) {
            return -1;
        }
        return 0;
    });

    return copia;
}

/**
 * mostrarFiltros()
 * Escribe los botones de filtro: primero "Todas" y luego cada categoria
 * del JSON. El boton del filtro activo lleva la clase "activo".
 */
function mostrarFiltros() {
    var contenedor = document.getElementById("filtros-categorias");

    // Si el contenedor no existe en la pagina, no hacemos nada
    if (contenedor === null) {
        return;
    }

    var categorias = obtenerCategorias();
    var html = "";

    // El boton de "Todas" va siempre el primero
    if (categoriaActual === "Todas") {
        html += '<button class="filtro activo" data-categoria="Todas" type="button">Todas</button>';
    } else {
        html += '<button class="filtro" data-categoria="Todas" type="button">Todas</button>';
    }

    // Y despues un boton por cada categoria
    for (var i = 0; i < categorias.length; i++) {
        // Si es la categoria que estamos viendo, le ponemos la clase "activo"
        if (categorias[i] === categoriaActual) {
            html += '<button class="filtro activo" data-categoria="' + categorias[i] + '" type="button">' + categorias[i] + '</button>';
        } else {
            html += '<button class="filtro" data-categoria="' + categorias[i] + '" type="button">' + categorias[i] + '</button>';
        }
    }

    contenedor.innerHTML = html;
}

/**
 * mostrarPagina()
 * Pinta las noticias de la pagina actual y luego la paginacion.
 * Si filtros o buscador dejan pocas noticias y la pagina actual ya no
 * existe, volvemos a la ultima pagina que si tiene contenido.
 */
function mostrarPagina() {
    var noticias = obtenerNoticiasFiltradas();

    // Math.ceil() redondea hacia arriba para saber cuantas paginas hay
    // Si no hay ninguna noticia, dejamos al menos una pagina
    var totalPaginas = Math.ceil(noticias.length / noticiasPorPagina);
    if (totalPaginas < 1) {
        totalPaginas = 1;
    }

    // Si pedimos una pagina que ya no existe, ajustamos a la ultima
    if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas;
    }

    // Cada pagina empieza en (numero de pagina - 1) * noticias por pagina
    var inicio = (paginaActual - 1) * noticiasPorPagina;
    var fin = inicio + noticiasPorPagina;

    // slice(inicio, fin) deja solo las noticias de esta pagina
    var noticiasDePagina = noticias.slice(inicio, fin);

    // mostrarCards() se encarga del aviso si el array llega vacio.
    // Le pasamos "listado" para que las cards lleven el estilo del listado.
    mostrarCards(noticiasDePagina, "grilla-noticias", rutaBase, "listado");

    mostrarPaginacion(totalPaginas);
}

/**
 * mostrarPaginacion(totalPaginas)
 * Escribe los botones de paginacion: "Anterior", un boton por pagina
 * y "Siguiente". Si solo hay una pagina, no escribe nada.
 */
function mostrarPaginacion(totalPaginas) {
    var contenedor = document.getElementById("paginacion");

    // Si el contenedor no existe en la pagina, no hacemos nada
    if (contenedor === null) {
        return;
    }

    // Con una sola pagina no hay nada que paginar
    if (totalPaginas === 1) {
        contenedor.innerHTML = "";
        return;
    }

    var html = "";

    // Boton "Anterior", deshabilitado si estamos en la primera pagina
    if (paginaActual === 1) {
        html += '<button class="pag-btn" data-pagina="' + (paginaActual - 1) + '" type="button" disabled>Anterior</button>';
    } else {
        html += '<button class="pag-btn" data-pagina="' + (paginaActual - 1) + '" type="button">Anterior</button>';
    }

    // Un boton por cada pagina, el actual con la clase "activo"
    for (var i = 1; i <= totalPaginas; i++) {
        if (i === paginaActual) {
            html += '<button class="pag-btn activo" data-pagina="' + i + '" type="button">' + i + '</button>';
        } else {
            html += '<button class="pag-btn" data-pagina="' + i + '" type="button">' + i + '</button>';
        }
    }

    // Boton "Siguiente", deshabilitado si estamos en la ultima pagina
    if (paginaActual === totalPaginas) {
        html += '<button class="pag-btn" data-pagina="' + (paginaActual + 1) + '" type="button" disabled>Siguiente</button>';
    } else {
        html += '<button class="pag-btn" data-pagina="' + (paginaActual + 1) + '" type="button">Siguiente</button>';
    }

    contenedor.innerHTML = html;
}

/**
 * mostrarMasLeidos()
 * Escribe la lista "Lo mas leido" del lateral, con las 4 noticias
 * que mas visitas tienen.
 */
function mostrarMasLeidos() {
    var contenedor = document.getElementById("lista-mas-leidos");

    // Si el contenedor no existe en la pagina, no hacemos nada
    if (contenedor === null) {
        return;
    }

    var masLeidas = obtenerMasLeidas(4);
    var html = "";

    // La posicion empieza en 1 porque es el lugar que ocupa en la lista
    for (var i = 0; i < masLeidas.length; i++) {
        html += crearItemMasLeido(masLeidas[i], i + 1, rutaBase);
    }

    contenedor.innerHTML = html;
}

/**
 * activarEventos()
 * Escucha los clics en los filtros y en la paginacion, y lo que se
 * escribe en el buscador. Cada contenedor lleva un solo addEventListener.
 */
function activarEventos() {
    // Un solo listener para todos los botones de filtro
    var contenedorFiltros = document.getElementById("filtros-categorias");
    if (contenedorFiltros !== null) {
        contenedorFiltros.addEventListener("click", function (event) {
            // Solo nos interesa si se ha pulsado un boton de filtro
            if (event.target.classList.contains("filtro")) {
                categoriaActual = event.target.dataset.categoria;

                // Al cambiar de filtro empezamos siempre en la primera pagina
                paginaActual = 1;

                mostrarFiltros();
                mostrarPagina();
            }
        });
    }

    // Un solo listener para todos los botones de paginacion
    var contenedorPaginacion = document.getElementById("paginacion");
    if (contenedorPaginacion !== null) {
        contenedorPaginacion.addEventListener("click", function (event) {
            var boton = event.target;

            // Los botones deshabilitados no cambian de pagina
            if (boton.classList.contains("pag-btn") && !boton.disabled) {
                // El atributo data-pagina es texto, lo convertimos con Number()
                paginaActual = Number(boton.dataset.pagina);

                mostrarPagina();

                // Volvemos arriba para que el usuario vea las noticias nuevas
                window.scrollTo(0, 0);
            }
        });
    }

    // El buscador va con "input" porque cambia con cada letra
    var campoBuscar = document.getElementById("campo-buscar");
    if (campoBuscar !== null) {
        campoBuscar.addEventListener("input", function (event) {
            textoBusqueda = event.target.value;

            // Buscar siempre vuelve a la primera pagina
            paginaActual = 1;

            mostrarPagina();
        });
    }
}

/**
 * init()
 * Espera a que se carguen los datos y despues llena toda la pagina.
 * Se usa then() porque cargarDatos() devuelve una promesa.
 */
function init() {
    cargarDatos(rutaBase).then(function () {
        leerCategoriaDeLaUrl();
        leerBusquedaDeLaUrl();
        mostrarFiltros();
        mostrarPagina();
        mostrarMasLeidos();
        activarEventos();
    });
}

// Llamamos a init() para que todo empiece al cargar la pagina
init();
