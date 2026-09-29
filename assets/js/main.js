/**
 * main.js
 * Espera a que el HTML este cargado y luego dibuja la cabecera y el pie comunes.
 * También conecta los botones de favorito y de compartir.
 */

// Ruta base de la pagina, para la necesita copiarEnlaceNoticia().
// Cada pagina (home.js, noticias.js, detalle.js) ya declara su propia
// "rutaBase" con const, asi que aqui la guardamos en otro nombre
// para no chocar con ellas.
var rutaBasePagina = "";

document.addEventListener("DOMContentLoaded", function () {

    // 1. Calculamos la ruta base segun donde este la pagina
    //    "" en la raiz del proyecto, "../" dentro de la carpeta pages
    var rutaBase = "";
    if (window.location.pathname.includes("/pages/")) {
        rutaBase = "../";
    }

    // La guardamos tambien en la variable de arriba, para compartir
    rutaBasePagina = rutaBase;

    // 2. Sacamos el nombre del archivo de la URL (lo que va despues de la ultima "/")
    var nombreArchivo = window.location.pathname.split("/").pop();

    // 3. Le quitamos la extension ".html"
    var paginaActiva = nombreArchivo.replace(".html", "");

    // 4. Si no queda nada, o es index.html, la pagina activa es "inicio"
    if (paginaActiva === "" || paginaActiva === "index") {
        paginaActiva = "inicio";
    }

    // 5. Dibujamos la cabecera y el pie
    renderHeader(rutaBase, paginaActiva);
    renderFooter(rutaBase);

    // Activamos el buscador de la cabecera
    activarBuscadorHeader();

    // 6. Marcamos los favoritos que ya estaban guardados
    marcarFavoritosGuardados();

    // 7. Activamos los botones de favorito y de compartir
    activarBotonesNoticias();
});

/**
 * activarBuscadorHeader()
 * Conecta el buscador de la cabecera.
 * Al pulsar Intro, si hay algo escrito nos lleva a Noticias con
 * ese texto en la URL, y si esta vacio, nos lleva a Noticias sin filtro.
 */
function activarBuscadorHeader() {
    var formulario = document.getElementById("form-buscador");

    // Si esta pagina no tiene buscador, no hacemos nada
    if (formulario === null) {
        return;
    }

    formulario.addEventListener("submit", function (event) {
        // Evitamos que el navegador mande el formulario por su cuenta
        event.preventDefault();

        // Leemos el texto del buscador y le quitamos los espacios de los extremos
        var campo = document.getElementById("buscador-header");
        var texto = "";

        if (campo !== null) {
            texto = campo.value.trim();
        }

        // Sin texto, vamos directamente al listado de Noticias
        if (texto === "") {
            window.location.href = rutaBasePagina + "pages/noticias.html";
            return;
        }

        // encodeURIComponent() deja el texto seguro dentro de la URL
        window.location.href = rutaBasePagina + "pages/noticias.html?buscar=" + encodeURIComponent(texto);
    });
}

/**
 * marcarFavoritosGuardados()
 * Recorre todos los botones de favorito y les pone la clase "activo"
 * si esa noticia ya está guardada en favoritos.
 * Se llama otra vez cada vez que se pinte una card nueva.
 */
function marcarFavoritosGuardados() {
    var botones = document.querySelectorAll(".btn-favorito");

    for (var i = 0; i < botones.length; i++) {
        // data-id es el número de la noticia
        if (esFavorito(botones[i].dataset.id)) {
            botones[i].classList.add("activo");
        } else {
            botones[i].classList.remove("activo");
        }
    }
}

/**
 * mostrarAviso(mensaje)
 * Muestra un cartelito negro abajo en la pantalla durante 2 segundos.
 * Si el cartelito ya existe, lo reutiliza.
 */
function mostrarAviso(mensaje) {
    var aviso = document.getElementById("aviso");

    // Si no existe todavia, lo creamos y lo pegamos al final del body
    if (aviso === null) {
        aviso = document.createElement("div");
        aviso.id = "aviso";
        aviso.className = "aviso";
        document.body.appendChild(aviso);
    }

    aviso.textContent = mensaje;
    aviso.classList.add("visible");

    // Pasados 2 segundos, el cartelito se oculta solo
    setTimeout(function () {
        aviso.classList.remove("visible");
    }, 2000);
}

/**
 * copiarEnlaceNoticia(id)
 * Copia al portapapeles el enlace de la noticia.
 * id: el número de la noticia.
 */
function copiarEnlaceNoticia(id) {
    // Montamos la URL completa de la pagina de detalle
    var url = new URL(rutaBasePagina + "pages/detalle.html?id=" + id, window.location.href).href;

    // Si el navegador deja copiar, copiamos
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url)
            .then(function () {
                mostrarAviso("Enlace copiado");
            })
            .catch(function () {
                mostrarAviso("No se pudo copiar el enlace");
            });
    } else {
        // Navegadores antiguos no tienen navigator.clipboard
        mostrarAviso("No se pudo copiar el enlace");
    }
}

/**
 * activarBotonesNoticias()
 * Escucha los clics de toda la pagina en un solo listener.
 * Las cards del Home se dibujan con JavaScript despues de cargar el HTML,
 * asi que escuchamos en "document" y no en cada boton.
 */
function activarBotonesNoticias() {
    document.addEventListener("click", function (event) {

        // closest() sube desde donde se ha hecho clic hasta el boton,
        // asi tambien funciona si el clic ha caido en el SVG de dentro
        var botonFavorito = event.target.closest(".btn-favorito");

        if (botonFavorito !== null) {
            var id = botonFavorito.dataset.id;

            // Alternar devuelve true si queda favorita y false si se quita
            var guardado = alternarFavorito(id);

            // Actualizamos todos los botones, no solo este
            marcarFavoritosGuardados();

            if (guardado) {
                mostrarAviso("Guardado en favoritos");
            } else {
                mostrarAviso("Quitado de favoritos");
            }

            return;
        }

        var botonCompartir = event.target.closest(".btn-compartir");

        if (botonCompartir !== null) {
            copiarEnlaceNoticia(botonCompartir.dataset.id);
        }
    });
}
