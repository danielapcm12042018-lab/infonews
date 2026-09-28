/**
 * renderHeader(rutaBase, paginaActiva)
 * Dibuja la cabecera comun de todas las paginas dentro de #app-header.
 * rutaBase: "" si la pagina esta en la raiz, "../" si esta dentro de pages/.
 * paginaActiva: nombre de la pagina actual ("inicio", "noticias", ...).
 */
function renderHeader(rutaBase, paginaActiva) {
    // Guardamos el HTML de la cabecera en una variable
    var html = `
        <header class="header">
            <div class="contenedor header-contenido">
                <!-- Logo del sitio -->
                <a href="${rutaBase}index.html" class="logo">InfoNews</a>

                <!-- Menu de navegacion principal -->
                <nav class="menu">
                    <a href="${rutaBase}index.html" class="${paginaActiva === "inicio" ? "activo" : ""}">Inicio</a>
                    <a href="${rutaBase}pages/noticias.html" class="${paginaActiva === "noticias" ? "activo" : ""}">Noticias</a>
                    <a href="${rutaBase}pages/favoritos.html" class="${paginaActiva === "favoritos" ? "activo" : ""}">Favoritos</a>
                    <a href="${rutaBase}pages/gestionar.html" class="${paginaActiva === "gestionar" ? "activo" : ""}">Gestionar</a>
                    <a href="${rutaBase}pages/contacto.html" class="${paginaActiva === "contacto" ? "activo" : ""}">Contacto</a>
                </nav>

                <!-- Buscador (aun sin funcionalidad) -->
                <form class="buscador" action="#" method="get">
                    <input type="search" name="buscar" placeholder="Buscar noticias...">
                </form>
            </div>
        </header>
    `;

    // Buscamos el contenedor de la cabecera y metemos el HTML dentro
    var contenedor = document.getElementById("app-header");
    contenedor.innerHTML = html;
}

/**
 * renderFooter(rutaBase)
 * Dibuja el pie comun de todas las paginas dentro de #app-footer.
 * rutaBase: "" si la pagina esta en la raiz, "../" si esta dentro de pages/.
 */
function renderFooter(rutaBase) {
    // Guardamos el HTML del pie en una variable
    var html = `
        <footer class="footer">
            <div class="contenedor footer-contenido">

                <!-- Bloque 1: datos de contacto -->
                <div class="footer-bloque">
                    <h3>Contacto</h3>
                    <p>Email: redaccion@infonews.com</p>
                    <p>Telefono: +34 910 000 000</p>
                    <p>Calle de la Prensa, 42. 28001 Madrid, España</p>
                </div>

                <!-- Bloque 2: enlaces legales -->
                <div class="footer-bloque">
                    <h3>Enlaces legales</h3>
                    <ul>
                        <li><a href="#">Politica de Privacidad</a></li>
                        <li><a href="#">Terminos y Condiciones</a></li>
                        <li><a href="#">Aviso Legal</a></li>
                        <li><a href="#">Politica de Cookies</a></li>
                    </ul>
                </div>

                <!-- Bloque 3: redes sociales -->
                <div class="footer-bloque">
                    <h3>Redes sociales</h3>
                    <ul>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">YouTube</a></li>
                        <li><a href="#">LinkedIn</a></li>
                    </ul>
                </div>
            </div>

            <!-- Linea de copyright -->
            <p class="footer-copyright">&copy; 2026 InfoNews. Todos los derechos reservados.</p>
        </footer>
    `;

    // Buscamos el contenedor del pie y metemos el HTML dentro
    var contenedor = document.getElementById("app-footer");
    contenedor.innerHTML = html;
}
