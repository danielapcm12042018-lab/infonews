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
            <div class="contenedor footer-fila">

                <!-- Copyright -->
                <p class="footer-copy">&copy; 2026 InfoNews. Todos los derechos reservados.</p>

                <!-- Enlaces legales -->
                <nav class="footer-legal" aria-label="Enlaces legales">
                    <a href="#">Política de Privacidad</a>
                    <a href="#">Términos y Condiciones</a>
                    <a href="#">Aviso Legal</a>
                    <a href="#">Política de Cookies</a>
                </nav>

                <!-- Redes sociales, solo iconos -->
                <div class="footer-redes">
                    <a href="#" aria-label="Facebook">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href="#" aria-label="Twitter">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                    <a href="#" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                    <a href="#" aria-label="YouTube">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                    </a>
                    <a href="#" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                </div>
            </div>
        </footer>
    `;

    // Buscamos el contenedor del pie y metemos el HTML dentro
    var contenedor = document.getElementById("app-footer");
    contenedor.innerHTML = html;
}
