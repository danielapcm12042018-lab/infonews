/**
 * contacto.js
 * Valida el formulario de contacto, ensena los errores bajo cada campo,
 * guarda el mensaje en localStorage y muestra la confirmacion.
 * Las reglas de validacion estan en validators.js, aqui no se reescriben.
 * Esta pagina no necesita leer el JSON de noticias.
 */

// Clave de localStorage donde se guardan los mensajes enviados
const claveMensajes = "infonews-mensajes";

/**
 * mostrarError(idCampo, mensaje)
 * Escribe (o borra) el mensaje de error de un campo.
 * Si el mensaje trae texto, marca el campo en rojo con la clase "campo-error".
 * Si alguno de los dos elementos no existe en la pagina, no hace nada.
 */
function mostrarError(idCampo, mensaje) {
    var campo = document.getElementById(idCampo);
    var textoError = document.getElementById("error-" + idCampo);

    // Si falta el campo o su hueco de error, no podemos hacer nada
    if (campo === null || textoError === null) {
        return;
    }

    textoError.textContent = mensaje;

    if (mensaje !== "") {
        // Hay error: marcamos el campo
        campo.classList.add("campo-error");
    } else {
        // Todo bien: quitamos la marca
        campo.classList.remove("campo-error");
    }
}

/**
 * limpiarErrores()
 * Quita el mensaje y la marca de error de los cuatro campos.
 */
function limpiarErrores() {
    mostrarError("nombre", "");
    mostrarError("correo", "");
    mostrarError("asunto", "");
    mostrarError("mensaje", "");
}

/**
 * validarFormulario()
 * Lee lo que ha escrito el usuario y valida los cuatro campos.
 * Devuelve true si todo esta bien, o false si hay algun error.
 */
function validarFormulario() {
    // Leemos el valor de cada campo
    var nombre = document.getElementById("nombre").value;
    var correo = document.getElementById("correo").value;
    var asunto = document.getElementById("asunto").value;
    var mensaje = document.getElementById("mensaje").value;

    // Cada validacion devuelve "" si esta bien, o el mensaje de error
    var errorNombre = validarCampoConReglas(nombre, "nombre", 3);
    var errorCorreo = validarCorreo(correo);
    var errorAsunto = validarCampoConReglas(asunto, "asunto", 3);
    var errorMensaje = validarCampoConReglas(mensaje, "mensaje", 10);

    // Los errores se ensenan debajo de cada campo
    mostrarError("nombre", errorNombre);
    mostrarError("correo", errorCorreo);
    mostrarError("asunto", errorAsunto);
    mostrarError("mensaje", errorMensaje);

    // Si los cuatro estan vacios, el formulario es valido
    if (errorNombre === "" && errorCorreo === "" && errorAsunto === "" && errorMensaje === "") {
        return true;
    }

    return false;
}

/**
 * guardarMensaje()
 * Guarda el mensaje en localStorage dentro de una lista.
 * Cada mensaje lleva nombre, correo, asunto, mensaje y la fecha de envio.
 */
function guardarMensaje() {
    // Leemos los valores y les quitamos los espacios de los extremos
    var nuevoMensaje = {
        nombre: document.getElementById("nombre").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        asunto: document.getElementById("asunto").value.trim(),
        mensaje: document.getElementById("mensaje").value.trim(),
        fecha: new Date().toISOString()
    };

    // Leemos la lista que ya habia guardada
    var lista = [];

    try {
        var textoGuardado = localStorage.getItem(claveMensajes);

        // Si ya habia mensajes, el texto es una lista en formato JSON
        if (textoGuardado !== null) {
            lista = JSON.parse(textoGuardado);
        }
    } catch (error) {
        // Si el texto estaba danado, empezamos una lista nueva
        console.error("No se pudieron leer los mensajes guardados: " + error.message);
        lista = [];
    }

    // Anadimos el mensaje nuevo y guardamos
    lista.push(nuevoMensaje);

    try {
        localStorage.setItem(claveMensajes, JSON.stringify(lista));
    } catch (error) {
        console.error("No se pudo guardar el mensaje: " + error.message);
    }
}

/**
 * mostrarConfirmacion()
 * Ensena el aviso de "mensaje enviado" y lo esconde a los 6 segundos.
 */
function mostrarConfirmacion() {
    var confirmacion = document.getElementById("mensaje-exito");

    if (confirmacion === null) {
        return;
    }

    // Quitamos el atributo hidden para que se vea
    confirmacion.removeAttribute("hidden");

    // Lo llevamos a la vista suavemente, centrado
    confirmacion.scrollIntoView({ behavior: "smooth", block: "center" });

    // A los 6 segundos lo volvemos a esconder
    setTimeout(function () {
        confirmacion.setAttribute("hidden", "");
    }, 6000);
}

/**
 * enviarFormulario(evento)
 * Se ejecuta al pulsar "Enviar Mensaje".
 * Si hay errores, no envia nada y lleva el foco al primer campo mal rellenado.
 */
function enviarFormulario(evento) {
    // Evitamos que el navegador recargue la pagina
    evento.preventDefault();

    if (validarFormulario() === false) {
        // Hay errores: llevamos al usuario al primero de ellos
        var primerError = document.querySelector(".campo-error");

        if (primerError !== null) {
            primerError.focus();
        }

        return;
    }

    // Todo correcto: guardamos, limpiamos el formulario y confirmamos
    guardarMensaje();
    document.getElementById("formulario-contacto").reset();
    limpiarErrores();
    mostrarConfirmacion();
}

/**
 * activarEventos()
 * Prepara el formulario para enviarlo y para corregir errores al escribir.
 */
function activarEventos() {
    var formulario = document.getElementById("formulario-contacto");

    // Si esta pagina no tiene formulario, no hacemos nada
    if (formulario === null) {
        return;
    }

    // Al enviar, llamamos a enviarFormulario()
    formulario.addEventListener("submit", enviarFormulario);

    // Cuando el usuario escribe en un campo con error, lo revisamos otra vez
    // para que el mensaje desaparezca en cuanto lo corrija
    formulario.addEventListener("input", function (evento) {
        if (evento.target.classList.contains("campo-error")) {
            validarFormulario();
        }
    });
}

/**
 * init()
 * Arranca la pagina preparando el formulario.
 */
function init() {
    activarEventos();
}

// Llamamos a init() para que todo empiece al cargar la pagina
init();
