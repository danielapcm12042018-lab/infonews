/**
 * gestionar.js
 * Permite crear noticias nuevas y eliminar las que ya no queremos mostrar.
 * Las noticias creadas se guardan en localStorage con las funciones de
 * storage.js, y las validaciones vienen de validators.js.
 * Esta pagina esta en pages/, asi que la ruta base es "../".
 */

// La pagina esta dentro de pages/, una carpeta por encima esta la raiz
const rutaBase = "../";

// Imagenes que se pueden elegir al crear una noticia
const imagenesDisponibles = ["detallen.jpg", "h_internacional.jpg", "hn_ciencia.jpg", "hn_economia_finanzas.jpg", "hn_cultura.jpg", "hn_sostenibilidad_ambiente.jpg", "h_salud.jpg", "hn_sociedad_tecnologia.jpg", "n_tecnologia.jpg"];

/**
 * llenarSelectores()
 * Llena los dos select del formulario: las categorias del JSON
 * y las imagenes disponibles.
 * La primera opcion vacia que ya trae el HTML se deja como estaba.
 */
function llenarSelectores() {
    var selectCategoria = document.getElementById("categoria");

    // Si el select no existe en esta pagina, no hacemos nada
    if (selectCategoria !== null) {
        var categorias = obtenerCategorias();

        for (var i = 0; i < categorias.length; i++) {
            // value y texto son el mismo nombre de categoria
            selectCategoria.innerHTML += '<option value="' + categorias[i] + '">' + categorias[i] + '</option>';
        }
    }

    var selectImagen = document.getElementById("imagen");

    if (selectImagen !== null) {
        for (var j = 0; j < imagenesDisponibles.length; j++) {
            var nombreArchivo = imagenesDisponibles[j];

            // Quitamos la extension para que el texto se lea mejor
            var textoImagen = nombreArchivo.replace(".jpg", "");

            selectImagen.innerHTML += '<option value="' + nombreArchivo + '">' + textoImagen + '</option>';
        }
    }
}

/**
 * mostrarError(idCampo, mensaje)
 * Escribe (o borra) el mensaje de error de un campo.
 * Si el mensaje trae texto, marca el campo con la clase "campo-error".
 * Si algo no existe en la pagina, no hace nada.
 */
function mostrarError(idCampo, mensaje) {
    var campo = document.getElementById(idCampo);
    var textoError = document.getElementById("error-" + idCampo);

    if (campo === null || textoError === null) {
        return;
    }

    textoError.textContent = mensaje;

    if (mensaje !== "") {
        campo.classList.add("campo-error");
    } else {
        campo.classList.remove("campo-error");
    }
}

/**
 * limpiarErrores()
 * Quita el mensaje y la marca de error de los seis campos.
 */
function limpiarErrores() {
    mostrarError("titulo", "");
    mostrarError("subtitulo", "");
    mostrarError("categoria", "");
    mostrarError("autor", "");
    mostrarError("imagen", "");
    mostrarError("contenido", "");
}

/**
 * validarFormulario()
 * Lee lo que ha escrito el usuario y valida los seis campos.
 * Devuelve true si todo esta bien, o false si hay algun error.
 */
function validarFormulario() {
    // Leemos el valor de cada campo
    var titulo = document.getElementById("titulo").value;
    var subtitulo = document.getElementById("subtitulo").value;
    var categoria = document.getElementById("categoria").value;
    var autor = document.getElementById("autor").value;
    var imagen = document.getElementById("imagen").value;
    var contenido = document.getElementById("contenido").value;

    // Cada validacion devuelve "" si esta bien, o el mensaje de error
    var errorTitulo = validarCampoConReglas(titulo, "título", 10);
    var errorSubtitulo = validarCampoConReglas(subtitulo, "subtítulo", 10);
    var errorAutor = validarCampoConReglas(autor, "autor", 3);
    var errorContenido = validarCampoConReglas(contenido, "contenido", 30);

    // La categoria y la imagen se eligen de una lista, no se escriben
    var errorCategoria = "";
    if (categoria === "") {
        errorCategoria = "Selecciona una categoría.";
    }

    var errorImagen = "";
    if (imagen === "") {
        errorImagen = "Selecciona una imagen.";
    }

    // Los errores se ensenan debajo de cada campo
    mostrarError("titulo", errorTitulo);
    mostrarError("subtitulo", errorSubtitulo);
    mostrarError("categoria", errorCategoria);
    mostrarError("autor", errorAutor);
    mostrarError("imagen", errorImagen);
    mostrarError("contenido", errorContenido);

    // Si los seis estan vacios, el formulario es valido
    if (errorTitulo === "" && errorSubtitulo === "" && errorCategoria === "" &&
        errorAutor === "" && errorImagen === "" && errorContenido === "") {
        return true;
    }

    return false;
}

/**
 * crearNoticia()
 * Arma el objeto de la noticia nueva con los valores del formulario.
 * Los campos son los mismos que usa el archivo noticias.json.
 * Devuelve el objeto, todavia sin guardar.
 */
function crearNoticia() {
    // Leemos los valores y les quitamos los espacios de los extremos
    var titulo = document.getElementById("titulo").value.trim();
    var subtitulo = document.getElementById("subtitulo").value.trim();
    var categoria = document.getElementById("categoria").value.trim();
    var autor = document.getElementById("autor").value.trim();
    var imagen = document.getElementById("imagen").value.trim();
    var contenido = document.getElementById("contenido").value.trim();

    // La fecha de hoy, con dos digitos en mes y dia
    var hoy = new Date();
    var mes = hoy.getMonth() + 1;
    var dia = hoy.getDate();

    if (mes < 10) {
        mes = "0" + mes;
    }

    if (dia < 10) {
        dia = "0" + dia;
    }

    var fecha = hoy.getFullYear() + "-" + mes + "-" + dia;

    // Una lectura de 200 palabras por minuto, redondeando hacia arriba
    var palabras = contenido.split(" ").length;
    var lecturaMin = Math.ceil(palabras / 200);

    // Aunque el texto sea muy corto, siempre cuenta al menos 1 minuto
    if (lecturaMin < 1) {
        lecturaMin = 1;
    }

    // La descripcion son los primeros 140 caracteres del contenido
    var descripcion = contenido.slice(0, 140);

    if (contenido.length > 140) {
        descripcion = descripcion + "...";
    }

    // El contenido se guarda como lista de parrafos
    var partes = contenido.split("\n\n");
    var parrafos = [];

    for (var i = 0; i < partes.length; i++) {
        var parrafo = partes[i].trim();

        // Descartamos los huecos que dejan lineas en blanco de mas
        if (parrafo !== "") {
            parrafos.push(parrafo);
        }
    }

    return {
        id: generarNuevoId(),
        titulo: titulo,
        subtitulo: subtitulo,
        categoria: categoria,
        autor: autor,
        cargoAutor: "Colaborador",
        fecha: fecha,
        lecturaMin: lecturaMin,
        visitas: 0,
        comentarios: 0,
        imagen: imagen,
        pieFoto: titulo,
        descripcion: descripcion,
        contenido: parrafos,
        cita: null,
        puntosClave: [],
        tags: [categoria],
        destacada: document.getElementById("destacada").checked
    };
}

/**
 * mostrarLista()
 * Pinta el listado de noticias, de la mas reciente a la mas antigua.
 * Tambien escribe cuantas hay en total.
 */
function mostrarLista() {
    var contenedorContador = document.getElementById("gestionar-contador");
    var contenedorLista = document.getElementById("lista-gestion");

    // Si esta pagina no tiene el listado, no hacemos nada
    if (contenedorLista === null) {
        return;
    }

    // Copia del array original, aqui si podemos ordenar sin miedo
    var noticias = obtenerNoticias().slice();

    // Primero por fecha de la mas nueva a la mas antigua
    noticias.sort(function (a, b) {
        if (a.fecha < b.fecha) {
            return 1;
        }
        if (a.fecha > b.fecha) {
            return -1;
        }

        // Si comparten fecha, va delante la de id mas alto
        return b.id - a.id;
    });

    // El contador va en singular si solo hay una noticia
    if (contenedorContador !== null) {
        var total = noticias.length;

        if (total === 1) {
            contenedorContador.textContent = "1 noticia publicada";
        } else {
            contenedorContador.textContent = total + " noticias publicadas";
        }
    }

    if (noticias.length === 0) {
        contenedorLista.innerHTML = '<p class="sin-resultados">No hay noticias. Crea una o restablece las originales.</p>';
        return;
    }

    var html = "";

    for (var i = 0; i < noticias.length; i++) {
        var noticia = noticias[i];
        var urlImagen = rutaBase + "assets/img/" + noticia.imagen;
        var urlDetalle = rutaBase + "pages/detalle.html?id=" + noticia.id;

        html += `
            <article class="item-gestion">
                <img src="${urlImagen}" alt="${noticia.titulo}">

                <div class="item-gestion-texto">
                    <span class="item-gestion-cat">${noticia.categoria}</span>

                    <h3>
                        <a href="${urlDetalle}">${noticia.titulo}</a>
                    </h3>

                    <p class="item-gestion-meta">${noticia.autor} · ${formatearFecha(noticia.fecha)}</p>
                </div>

                <button class="btn-eliminar" data-id="${noticia.id}" type="button">Eliminar</button>
            </article>
        `;
    }

    contenedorLista.innerHTML = html;
}

/**
 * mostrarConfirmacion()
 * Ensena el aviso de "noticia creada" y lo esconde a los 5 segundos.
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

    // A los 5 segundos lo volvemos a esconder
    setTimeout(function () {
        confirmacion.setAttribute("hidden", "");
    }, 5000);
}

/**
 * enviarFormulario(evento)
 * Se ejecuta al pulsar "Publicar noticia".
 * Si hay errores, no guarda nada y lleva el foco al primer campo malo.
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

    // Todo correcto: guardamos la noticia, limpiamos el formulario y avisamos
    guardarNoticiaCreada(crearNoticia());
    document.getElementById("formulario-noticia").reset();
    limpiarErrores();
    mostrarLista();
    mostrarConfirmacion();
}

/**
 * activarEventos()
 * Prepara el formulario, el boton de eliminar y el de restablecer.
 * Cada elemento se busca por su id, y si no existe se salta sin error.
 */
function activarEventos() {
    // --- Formulario de creacion ---
    var formulario = document.getElementById("formulario-noticia");

    if (formulario !== null) {
        formulario.addEventListener("submit", enviarFormulario);

        // Al escribir en un campo con error, lo revisamos otra vez
        // para que el mensaje desaparezca en cuanto lo corrija
        formulario.addEventListener("input", function (evento) {
            if (evento.target.classList.contains("campo-error")) {
                validarFormulario();
            }
        });

        // Los select no sueltan "input", sueltan "change"
        formulario.addEventListener("change", function (evento) {
            if (evento.target.classList.contains("campo-error")) {
                validarFormulario();
            }
        });
    }

    // --- Boton de eliminar de cada noticia ---
    var listaGestion = document.getElementById("lista-gestion");

    if (listaGestion !== null) {
        listaGestion.addEventListener("click", function (evento) {
            // Un solo listener vale para todos los botones "Eliminar"
            var boton = evento.target.closest(".btn-eliminar");

            if (boton === null) {
                return;
            }

            // Le pedimos confirmacion antes de borrar
            if (confirm("¿Eliminar esta noticia?") === false) {
                return;
            }

            eliminarNoticia(boton.dataset.id);
            mostrarLista();
            mostrarAviso("Noticia eliminada");
        });
    }

    // --- Boton de restablecer ---
    var botonRestablecer = document.getElementById("btn-restablecer");

    if (botonRestablecer !== null) {
        botonRestablecer.addEventListener("click", function () {
            if (confirm("¿Restablecer las noticias originales? Se borrarán las que creaste.") === false) {
                return;
            }

            restablecerNoticias();
            mostrarLista();
            mostrarAviso("Noticias restablecidas");
        });
    }
}

/**
 * init()
 * Espera a que se carguen los datos y despues prepara la pagina.
 * Se usa then() porque cargarDatos() devuelve una promesa.
 */
function init() {
    cargarDatos(rutaBase).then(function () {
        llenarSelectores();
        mostrarLista();
        activarEventos();
    });
}

// Llamamos a init() para que todo empiece al cargar la pagina
init();
