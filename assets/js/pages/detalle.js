/**
 * detalle.js
 * Lee el id de la URL, busca la noticia en el JSON y llena las zonas
 * de detalle.html: cabecera, imagen, autor, texto, etiquetas y laterales.
 * Usa las funciones que ya existen en data.js y render.js.
 */

// La pagina esta dentro de pages/, asi que las rutas llevan "../"
const rutaBase = "../";

/**
 * leerIdDeLaUrl()
 * Lee el parametro "id" de la URL, por ejemplo detalle.html?id=3.
 * Devuelve el texto del id, o null si el parametro no existe.
 */
function leerIdDeLaUrl() {
    return new URLSearchParams(window.location.search).get("id");
}

/**
 * mostrarNoNoEncontrada()
 * Escribe el aviso de "noticia no encontrada" en el main,
 * replacing todo lo que hubiera antes.
 */
function mostrarNoNoEncontrada() {
    var main = document.querySelector("main");

    // Si la pagina no tiene main, no hacemos nada
    if (main === null) {
        return;
    }

    main.innerHTML = `
        <div class="contenedor sin-resultados">
            <h1>Noticia no encontrada</h1>
            <p>La noticia que buscas no existe o fue eliminada.</p>
            <a class="btn btn-primario" href="noticias.html">Volver a noticias</a>
        </div>
    `;
}

/**
 * obtenerIniciales(nombre)
 * Devuelve las iniciales en mayusculas de las dos primeras palabras
 * del nombre. Por ejemplo "Elena Rodriguez" devuelve "ER".
 */
function obtenerIniciales(nombre) {
    // split(" ") separa el nombre en un array de palabras
    var palabras = nombre.split(" ");

    // Nos quedamos con la primera letra de cada palabra, en mayusculas
    var primera = palabras[0].charAt(0).toUpperCase();

    // Si el nombre solo tiene una palabra, no hay segunda inicial
    if (palabras.length < 2) {
        return primera;
    }

    var segunda = palabras[1].charAt(0).toUpperCase();

    return primera + segunda;
}

/**
 * mostrarCabecera(noticia)
 * Escribe la miga de la categoria, el badge, el titulo y el subtitulo.
 * Tambien cambia el nombre de la pestaña del navegador.
 */
function mostrarCabecera(noticia) {
    var miga = document.getElementById("miga-categoria");
    if (miga !== null) {
        // La categoria se ve en mayusculas en la miga
        miga.textContent = noticia.categoria.toUpperCase();
    }

    var cabecera = document.getElementById("articulo-cabecera");
    if (cabecera !== null) {
        cabecera.innerHTML = `
            <span class="badge">${noticia.categoria}</span>
            <h1 class="articulo-titulo">${noticia.titulo}</h1>
            <p class="articulo-subtitulo">${noticia.subtitulo}</p>
        `;
    }

    // El titulo de la pestaña pasa a ser el de la noticia
    document.title = "InfoNews | " + noticia.titulo;
}

/**
 * mostrarFigura(noticia)
 * Escribe la imagen principal y el pie de foto.
 */
function mostrarFigura(noticia) {
    var figura = document.getElementById("articulo-figura");

    // Si el contenedor no existe en la pagina, no hacemos nada
    if (figura === null) {
        return;
    }

    var urlImagen = rutaBase + "assets/img/" + noticia.imagen;

    figura.innerHTML = `
        <img src="${urlImagen}" alt="${noticia.titulo}">
        <figcaption>${noticia.pieFoto}</figcaption>
    `;
}

/**
 * mostrarMeta(noticia)
 * Escribe el bloque del autor y la fila de datos de la noticia.
 */
function mostrarMeta(noticia) {
    var contenedor = document.getElementById("articulo-meta");

    // Si el contenedor no existe en la pagina, no hacemos nada
    if (contenedor === null) {
        return;
    }

    // Las visitas se separan con punto de miles al estilo español
    var visitas = noticia.visitas.toLocaleString("es-ES");

    contenedor.innerHTML = `
        <div class="autor">
            <span class="autor-avatar">${obtenerIniciales(noticia.autor)}</span>
            <div>
                <strong>${noticia.autor}</strong>
                <span>${noticia.cargoAutor}</span>
            </div>
        </div>

        <div class="meta-datos">
            <span class="meta-dato">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                ${formatearFecha(noticia.fecha)}
            </span>
            <span class="meta-dato">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                ${visitas} visitas
            </span>
            <span class="meta-dato">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                ${noticia.lecturaMin} min de lectura
            </span>
            <span class="meta-dato">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ${noticia.comentarios} comentarios
            </span>
        </div>
    `;
}

/**
 * mostrarTexto(noticia)
 * Arma el cuerpo del articulo: los dos primeros parrafos, la cita,
 * los puntos clave y el resto de parrafos.
 * Si la noticia no tiene cita o no tiene puntos clave, no deja
 * bloques vacios, simplemente no escribe esa parte.
 */
function mostrarTexto(noticia) {
    var contenedor = document.getElementById("articulo-texto");

    // Si el contenedor no existe en la pagina, no hacemos nada
    if (contenedor === null) {
        return;
    }

    var parrafos = noticia.contenido;
    var html = "";

    // a) Los dos primeros parrafos
    for (var i = 0; i < 2 && i < parrafos.length; i++) {
        html += `<p>${parrafos[i]}</p>`;
    }

    // b) La cita, solo si la noticia la tiene.
    // Las comillas las pone el CSS con ::before, aqui van sin escribir
    if (noticia.cita !== null && noticia.cita !== undefined) {
        html += `
            <blockquote class="articulo-cita">
                <p class="cita-texto">${noticia.cita.texto}</p>
                <cite class="cita-autor">— ${noticia.cita.autor}</cite>
            </blockquote>
        `;
    }

    // c) Los puntos clave, solo si hay alguno.
    // El titulo va dentro de la caja, en pequeño
    if (noticia.puntosClave.length > 0) {
        html += '<div class="puntos-clave">';

        html += '<h3 class="puntos-titulo">Puntos clave del análisis:</h3>';

        html += "<ul>";

        for (var j = 0; j < noticia.puntosClave.length; j++) {
            html += `<li>${noticia.puntosClave[j]}</li>`;
        }

        html += "</ul></div>";
    }

    // d) El resto de parrafos, desde el tercero
    for (var k = 2; k < parrafos.length; k++) {
        html += `<p>${parrafos[k]}</p>`;
    }

    contenedor.innerHTML = html;
}

/**
 * mostrarTags(noticia)
 * Escribe una etiqueta por cada tag de la noticia.
 */
function mostrarTags(noticia) {
    var contenedor = document.getElementById("articulo-tags");

    // Si el contenedor no existe en la pagina, no hacemos nada
    if (contenedor === null) {
        return;
    }

    var html = "";

    for (var i = 0; i < noticia.tags.length; i++) {
        html += `<span class="tag">#${noticia.tags[i]}</span>`;
    }

    contenedor.innerHTML = html;
}

/**
 * mostrarLateral(noticia)
 * Llena las dos cajas de la barra lateral: "Lo mas leido" con 3
 * noticias y "Mas noticias" con 2 que no son la que estamos viendo.
 */
function mostrarLateral(noticia) {
    var masLeidos = document.getElementById("lista-mas-leidos");
    if (masLeidos !== null) {
        var leidas = obtenerMasLeidas(3);
        var htmlLeidas = "";

        for (var i = 0; i < leidas.length; i++) {
            // La posicion empieza en 1
            htmlLeidas += crearItemMasLeido(leidas[i], i + 1, rutaBase);
        }

        masLeidos.innerHTML = htmlLeidas;
    }

    var masNoticias = document.getElementById("lista-mas-noticias");
    if (masNoticias !== null) {
        // Quitamos la noticia actual y nos quedamos con las 2 siguientes
        var otras = obtenerUltimas(12).filter(function (otra) {
            return otra.id !== noticia.id;
        });

        otras = otras.slice(0, 2);

        var htmlOtras = "";
        for (var j = 0; j < otras.length; j++) {
            htmlOtras += crearCardSimple(otras[j], rutaBase);
        }

        masNoticias.innerHTML = htmlOtras;
    }
}

/**
 * mostrarRelacionadas(noticia)
 * Escribe las 3 noticias mas parecidas a la que estamos viendo.
 */
function mostrarRelacionadas(noticia) {
    var contenedor = document.getElementById("lista-relacionadas");

    // Si el contenedor no existe en la pagina, no hacemos nada
    if (contenedor === null) {
        return;
    }

    var relacionadas = obtenerRelacionadas(noticia, 3);
    var html = "";

    for (var i = 0; i < relacionadas.length; i++) {
        html += crearCardSimple(relacionadas[i], rutaBase);
    }

    contenedor.innerHTML = html;
}

/**
 * init()
 * Espera a que se carguen los datos, busca la noticia del id de la URL
 * y llama a cada función para llenar la pagina.
 * Si el id no existe, avisa con el mensaje de "noticia no encontrada".
 * Se usa then() porque cargarDatos() devuelve una promesa.
 */
function init() {
    var id = leerIdDeLaUrl();

    cargarDatos(rutaBase).then(function () {
        var noticia = buscarNoticiaPorId(id);

        // Si la noticia no existe, avisamos y no llenamos nada más
        if (noticia === null) {
            mostrarNoNoEncontrada();
            return;
        }

        mostrarCabecera(noticia);
        mostrarFigura(noticia);
        mostrarMeta(noticia);
        mostrarTexto(noticia);
        mostrarTags(noticia);
        mostrarLateral(noticia);
        mostrarRelacionadas(noticia);

        // El boton grande de favorito necesita el id de esta noticia
        activarFavoritoDetalle(noticia);
    });
}

/**
 * activarFavoritoDetalle(noticia)
 * Pone el id de la noticia en el boton grande de favorito
 * y lo deja marcado si ya estaba en favoritos.
 */
function activarFavoritoDetalle(noticia) {
    var boton = document.getElementById("btn-favorito-detalle");

    if (boton === null) {
        return;
    }

    // El id se guarda como atributo para que los clics lo puedan leer
    boton.setAttribute("data-id", noticia.id);

    // Marcamos todos los botones de favorito, tambien este
    marcarFavoritosGuardados();
}

// Llamamos a init() para que todo empiece al cargar la pagina
init();
