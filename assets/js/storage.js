/**
 * storage.js
 * Guarda y lee los favoritos de las noticias en localStorage.
 * Solo se guarda una lista de ids, por ejemplo [1, 5, 8].
 * Todas las páginas usan estas funciones en vez de tocar localStorage.
 */

// Nombre de la clave donde se guardan los ids
const claveFavoritos = "infonews-favoritos";

// Claves para las noticias que crea el usuario y para las que elimina
const claveNoticiasCreadas = "infonews-noticias-creadas";
const claveNoticiasEliminadas = "infonews-noticias-eliminadas";

/**
 * obtenerFavoritos()
 * Devuelve el array de ids guardados.
 * Si todavia no hay nada guardado, o si el texto esta dañado,
 * devuelve un array vacio para que la pagina siga funcionando.
 */
function obtenerFavoritos() {
    try {
        // Leemos el texto guardado con la clave
        var texto = localStorage.getItem(claveFavoritos);

        // Si no hay nada, no hay favoritos todavia
        if (texto === null) {
            return [];
        }

        // El texto guardado es un array en formato JSON, lo pasamos a array
        return JSON.parse(texto);
    } catch (error) {
        // Si el texto estaba dañado, JSON.parse falla y saltamos al catch
        console.error("No se pudieron leer los favoritos: " + error.message);
        return [];
    }
}

/**
 * guardarFavoritos(lista)
 * Convierte la lista de ids en texto y la guarda en localStorage.
 * lista: un array de numeros, por ejemplo [1, 5, 8].
 */
function guardarFavoritos(lista) {
    try {
        // stringify() convierte el array en texto para poder guardarlo
        localStorage.setItem(claveFavoritos, JSON.stringify(lista));
    } catch (error) {
        // Por ejemplo, si el navegador tiene la almacenamiento lleno
        console.error("No se pudieron guardar los favoritos: " + error.message);
    }
}

/**
 * esFavorito(id)
 * Devuelve true si esa noticia ya esta en favoritos, y false si no.
 * El id se convierte a numero, porque los ids del JSON son numeros.
 */
function esFavorito(id) {
    var idNumero = Number(id);

    // includes() nos dice si el id esta dentro del array
    return obtenerFavoritos().includes(idNumero);
}

/**
 * agregarFavorito(id)
 * Agrega una noticia a favoritos, solo si no estaba antes.
 */
function agregarFavorito(id) {
    var idNumero = Number(id);
    var lista = obtenerFavoritos();

    // Si ya estaba, no lo agregamos otra vez
    if (lista.includes(idNumero)) {
        return;
    }

    // push() pone el id al final del array
    lista.push(idNumero);

    guardarFavoritos(lista);
}

/**
 * quitarFavorito(id)
 * Borra una noticia de favoritos.
 */
function quitarFavorito(id) {
    var idNumero = Number(id);

    // filter() crea un array nuevo con todos menos ese id
    var listaSinEse = obtenerFavoritos().filter(function (idGuardado) {
        return idGuardado !== idNumero;
    });

    guardarFavoritos(listaSinEse);
}

/**
 * alternarFavorito(id)
 * Si la noticia estaba en favoritos la quita, y si no, la agrega.
 * Devuelve true si la noticia ha quedado como favorita,
 * y false si la ha dejado de serlo.
 */
function alternarFavorito(id) {
    // esFavorito() ya convierte el id a numero por nosotros
    if (esFavorito(id)) {
        quitarFavorito(id);
        return false;
    }

    agregarFavorito(id);
    return true;
}

/**
 * contarFavoritos()
 * Devuelve cuantos favoritos hay guardados.
 */
function contarFavoritos() {
    return obtenerFavoritos().length;
}

/**
 * obtenerNoticiasCreadas()
 * Devuelve la lista de noticias que el usuario ha creado.
 * Si todavia no hay nada guardado, o si el texto esta dañado,
 * devuelve un array vacio.
 */
function obtenerNoticiasCreadas() {
    try {
        // Leemos el texto guardado con la clave
        var texto = localStorage.getItem(claveNoticiasCreadas);

        // Si no hay nada, no hay noticias creadas todavia
        if (texto === null) {
            return [];
        }

        // El texto guardado es un array en formato JSON
        return JSON.parse(texto);
    } catch (error) {
        console.error("No se pudieron leer las noticias creadas: " + error.message);
        return [];
    }
}

/**
 * guardarNoticiaCreada(noticia)
 * Guarda una noticia nueva al principio de la lista de creadas.
 * Asi la ultima noticia creada aparece la primera.
 */
function guardarNoticiaCreada(noticia) {
    var lista = obtenerNoticiasCreadas();

    // unshift() pone la noticia al inicio del array
    lista.unshift(noticia);

    try {
        localStorage.setItem(claveNoticiasCreadas, JSON.stringify(lista));
    } catch (error) {
        console.error("No se pudo guardar la noticia creada: " + error.message);
    }
}

/**
 * obtenerIdsEliminados()
 * Devuelve los ids de las noticias del JSON que el usuario ha eliminado.
 * Siempre son numeros. Si no hay nada guardado devuelve un array vacio.
 */
function obtenerIdsEliminados() {
    try {
        var texto = localStorage.getItem(claveNoticiasEliminadas);

        if (texto === null) {
            return [];
        }

        var lista = JSON.parse(texto);
        var numeros = [];

        // Nos aseguramos de que todos los ids sean numeros
        for (var i = 0; i < lista.length; i++) {
            numeros.push(Number(lista[i]));
        }

        return numeros;
    } catch (error) {
        console.error("No se pudieron leer las noticias eliminadas: " + error.message);
        return [];
    }
}

/**
 * eliminarNoticia(id)
 * Elimina una noticia.
 * Si era una noticia creada por el usuario, se borra de esa lista.
 * Si era una noticia del JSON, se apunta su id en la lista de eliminadas.
 * En los dos casos se quita tambien de favoritos.
 */
function eliminarNoticia(id) {
    // Los ids siempre se manejan como numeros
    var idNumero = Number(id);
    var creadas = obtenerNoticiasCreadas();

    // some() nos dice si hay alguna noticia creada con ese id
    var estaCreada = creadas.some(function (noticia) {
        return noticia.id === idNumero;
    });

    if (estaCreada) {
        // Es una noticia creada: guardamos la lista sin ella
        var creadasRestantes = creadas.filter(function (noticia) {
            return noticia.id !== idNumero;
        });

        try {
            localStorage.setItem(claveNoticiasCreadas, JSON.stringify(creadasRestantes));
        } catch (error) {
            console.error("No se pudieron guardar las noticias creadas: " + error.message);
        }
    } else {
        // Es una noticia del JSON: apuntamos su id, sin repetirlo
        var eliminadas = obtenerIdsEliminados();

        if (eliminadas.includes(idNumero) === false) {
            eliminadas.push(idNumero);
        }

        try {
            localStorage.setItem(claveNoticiasEliminadas, JSON.stringify(eliminadas));
        } catch (error) {
            console.error("No se pudieron guardar las noticias eliminadas: " + error.message);
        }
    }

    // Pase lo que pase, la noticia deja de ser favorita
    quitarFavorito(idNumero);
}

/**
 * restablecerNoticias()
 * Borra las noticias creadas y las eliminadas, para volver a ver
 * el listado original del JSON. Los favoritos no se tocan.
 */
function restablecerNoticias() {
    try {
        localStorage.removeItem(claveNoticiasCreadas);
        localStorage.removeItem(claveNoticiasEliminadas);
    } catch (error) {
        console.error("No se pudieron restablecer las noticias: " + error.message);
    }
}
