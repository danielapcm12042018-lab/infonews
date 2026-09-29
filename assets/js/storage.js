/**
 * storage.js
 * Guarda y lee los favoritos de las noticias en localStorage.
 * Solo se guarda una lista de ids, por ejemplo [1, 5, 8].
 * Todas las páginas usan estas funciones en vez de tocar localStorage.
 */

// Nombre de la clave donde se guardan los ids
const claveFavoritos = "infonews-favoritos";

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
