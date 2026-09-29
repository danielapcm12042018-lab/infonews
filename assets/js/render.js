/**
 * render.js
 * Funciones que CREAN el HTML de las noticias.
 * Todas devuelven un texto de HTML (string) usando template literals.
 * La mayoria no tocan el DOM, solo mostrarCards() escribe en la pagina.
 */

/**
 * formatearFecha(fechaTexto)
 * Convierte una fecha "AAAA-MM-DD" en un texto como "24 Sep, 2026".
 * Usa split() en vez de new Date() para no complicarlo.
 */
function formatearFecha(fechaTexto) {
    // Los 12 meses del ano abreviados en espanol
    var meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
                 "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    // "2026-09-24" se separa en ["2026", "09", "24"]
    var partes = fechaTexto.split("-");

    var anio = partes[0];
    var dia = partes[2];

    // El mes viene como texto ("09"), al restarle 1 obtenemos el indice del array
    var mes = meses[Number(partes[1]) - 1];

    return dia + " " + mes + ", " + anio;
}

/**
 * crearCardNoticia(noticia, rutaBase, variante)
 * Devuelve el HTML de una tarjeta de noticia completa.
 * noticia: un objeto del JSON.
 * rutaBase: "" si la pagina esta en la raiz, "../" si esta dentro de pages/.
 * variante: es opcional. Si vale "listado" la card lleva la clase extra
 * "card-listado", que es la que usa la pagina de listado de noticias.
 * Incluye la imagen, el autor, la fecha, el titulo, la descripcion,
 * el boton de favorito y el enlace "Leer mas".
 */
function crearCardNoticia(noticia, rutaBase, variante) {
    // Ruta de la imagen, con rutaBase para que funcione en cualquier pagina
    var urlImagen = rutaBase + "assets/img/" + noticia.imagen;

    // Ruta del detalle. El id se manda en la URL para saber que noticia abrir
    var urlDetalle = rutaBase + "pages/detalle.html?id=" + noticia.id;

    // Solo en el listado añadimos la clase "card-listado".
    // En el Home no llega variante, asi que la card se queda como estaba.
    var claseCard = "card";
    if (variante === "listado") {
        claseCard = "card card-listado";
    }

    return `
        <article class="${claseCard}">
            <!-- Imagen con la categoria encima -->
            <div class="card-imagen">
                <img src="${urlImagen}" alt="${noticia.titulo}">
                <span class="badge">${noticia.categoria}</span>
            </div>

            <div class="card-cuerpo">
                <!-- Autor y fecha, con un icono de calendario delante de la fecha -->
                <p class="card-meta">
                    <span class="meta-autor">${noticia.autor}</span>
                    <span class="meta-fecha">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                        ${formatearFecha(noticia.fecha)}
                    </span>
                </p>

                <!-- Titulo que lleva a la pagina de detalle -->
                <h3 class="card-titulo">
                    <a href="${urlDetalle}">${noticia.titulo}</a>
                </h3>

                <p class="card-descripcion">${noticia.descripcion}</p>

                <!-- Pie: botones de favorito y compartir, y enlace para leer la noticia entera -->
                <div class="card-pie">
                    <div class="card-acciones">
                        <button class="btn-favorito" data-id="${noticia.id}" type="button" aria-label="Guardar en favoritos">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                        </button>
                        <button class="btn-compartir" data-id="${noticia.id}" type="button" aria-label="Compartir noticia">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                        </button>
                    </div>
                    <a class="leer-mas" href="${urlDetalle}">Leer más →</a>
                </div>
            </div>
        </article>
    `;
}

/**
 * crearCardSimple(noticia, rutaBase)
 * Devuelve el HTML de una tarjeta pequena.
 * Se usa en "Relacionadas" y en "Mas noticias", donde no cabe una tarjeta grande.
 * Lleva imagen, categoria, titulo enlazado al detalle y fecha.
 */
function crearCardSimple(noticia, rutaBase) {
    var urlImagen = rutaBase + "assets/img/" + noticia.imagen;
    var urlDetalle = rutaBase + "pages/detalle.html?id=" + noticia.id;

    return `
        <article class="card-simple">
            <!-- Imagen pequena con la categoria encima -->
            <div class="card-simple-imagen">
                <img src="${urlImagen}" alt="${noticia.titulo}">
                <span class="badge">${noticia.categoria}</span>
            </div>

            <div class="card-simple-cuerpo">
                <h3 class="card-simple-titulo">
                    <a href="${urlDetalle}">${noticia.titulo}</a>
                </h3>
                <p class="card-simple-fecha">${formatearFecha(noticia.fecha)}</p>
            </div>
        </article>
    `;
}

/**
 * crearItemMasLeido(noticia, posicion, rutaBase)
 * Devuelve el HTML de un elemento de la lista "Mas leidas".
 * posicion es el lugar que ocupa la noticia (1, 2, 3...) y se muestra
 * con dos digitos: 01, 02, 03...
 */
function crearItemMasLeido(noticia, posicion, rutaBase) {
    var urlDetalle = rutaBase + "pages/detalle.html?id=" + noticia.id;

    // El numero va dentro de su propio span, para poder darle estilo aparte
    var numero = ("0" + posicion).slice(-2);

    return `
        <li class="mas-leido-item">
            <span class="mas-leido-numero">${numero}</span>
            <div class="mas-leido-texto">
                <span class="mas-leido-cat">${noticia.categoria}</span>
                <a class="mas-leido-titulo" href="${urlDetalle}">${noticia.titulo}</a>
            </div>
        </li>
    `;
}

/**
 * mostrarCards(noticias, idContenedor, rutaBase, variante)
 * Escribe dentro del contenedor las tarjetas del array de noticias.
 * variante es opcional y se pasa a crearCardNoticia(), para poder pintar
 * las cards del listado de otra forma sin tocar el Home.
 * Si el array llega vacio, escribe un mensaje de "no hay resultados".
 * Si el contenedor no existe en esta pagina, no hace nada y no da error.
 */
function mostrarCards(noticias, idContenedor, rutaBase, variante) {
    // Buscamos el elemento donde se van a poner las noticias
    var contenedor = document.getElementById(idContenedor);

    // Si ese id no existe en la pagina, salimos sin hacer nada
    if (contenedor === null) {
        return;
    }

    // Si no hay noticias, mostramos un aviso
    if (noticias.length === 0) {
        contenedor.innerHTML = `
            <p class="sin-resultados">No se encontraron noticias.</p>
        `;
        return;
    }

    // Vamos juntando el HTML de cada tarjeta en un solo texto
    var html = "";
    for (var i = 0; i < noticias.length; i++) {
        // Le pasamos la variante para que crearCardNoticia sepa que pintar
        html += crearCardNoticia(noticias[i], rutaBase, variante);
    }

    // Escribimos todo el HTML de golpe dentro del contenedor
    contenedor.innerHTML = html;
}
