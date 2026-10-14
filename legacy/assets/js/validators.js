/**
 * validators.js
 * Funciones de validacion sencillas que se pueden usar en varios formularios
 * (Contacto y Gestionar).
 *
 * Todas reciben un texto y devuelven un mensaje de error (string) si algo
 * esta mal, o un texto vacio "" si todo esta bien.
 * Ninguna de estas funciones toca la pagina, solo trabajan con texto.
 */

/**
 * validarObligatorio(texto, nombreCampo)
 * Comprueba que el campo no este vacio.
 * nombreCampo es el nombre que se muestra en el mensaje, por ejemplo "nombre".
 */
function validarObligatorio(texto, nombreCampo) {
    // trim() quita los espacios del principio y del final
    var limpio = texto.trim();

    // Si al quitar los espacios no queda nada, el campo esta vacio
    if (limpio === "") {
        return "El campo " + nombreCampo + " es obligatorio.";
    }

    return "";
}

/**
 * validarLongitudMinima(texto, minimo, nombreCampo)
 * Comprueba que el texto tenga al menos "minimo" caracteres.
 */
function validarLongitudMinima(texto, minimo, nombreCampo) {
    // Contamos solo el texto, sin los espacios de los extremos
    var limpio = texto.trim();

    if (limpio.length < minimo) {
        return "El campo " + nombreCampo + " debe tener al menos " + minimo + " caracteres.";
    }

    return "";
}

/**
 * validarCorreo(texto)
 * Comprueba que el correo no este vacio y que tenga un formato valido.
 */
function validarCorreo(texto) {
    var limpio = texto.trim();

    // Primero miramos que no este vacio
    if (limpio === "") {
        return "El correo electrónico es obligatorio.";
    }

    // Esta expresion regular pide algo@algo.algo, sin espacios
    var formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(limpio)) {
        return "Escribe un correo válido, por ejemplo nombre@dominio.com.";
    }

    return "";
}

/**
 * validarUrlImagen(texto)
 * Comprueba que la direccion de una imagen sea valida.
 * Es opcional: si el campo esta vacio, no da error.
 */
function validarUrlImagen(texto) {
    var limpio = texto.trim();

    // La imagen es opcional, asi que vacio esta bien
    if (limpio === "") {
        return "";
    }

    // Vale una direccion web o un archivo de la carpeta de imagenes
    var esWeb = limpio.startsWith("http://") || limpio.startsWith("https://");
    var esArchivo = limpio.startsWith("assets/");

    if (!esWeb && !esArchivo) {
        return "Escribe una URL que empiece con http:// o https://, o un nombre de archivo de la carpeta de imágenes.";
    }

    return "";
}

/**
 * validarCampoConReglas(texto, nombreCampo, minimo)
 * Une dos reglas: primero que el campo no este vacio
 * y despues que tenga la longitud minima.
 */
function validarCampoConReglas(texto, nombreCampo, minimo) {
    // Primero la regla de obligatorio
    var errorObligatorio = validarObligatorio(texto, nombreCampo);

    if (errorObligatorio !== "") {
        return errorObligatorio;
    }

    // Si paso la primera regla, miramos la longitud minima
    return validarLongitudMinima(texto, minimo, nombreCampo);
}
