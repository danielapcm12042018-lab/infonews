/**
 * main.js
 * Espera a que el HTML este cargado y luego dibuja la cabecera y el pie comunes.
 */
document.addEventListener("DOMContentLoaded", function () {

    // 1. Calculamos la ruta base segun donde este la pagina
    //    "" en la raiz del proyecto, "../" dentro de la carpeta pages
    var rutaBase = "";
    if (window.location.pathname.includes("/pages/")) {
        rutaBase = "../";
    }

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
});
