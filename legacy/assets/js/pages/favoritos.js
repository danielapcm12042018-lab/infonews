/**
 * favoritos.js
 * Muestra las noticias que el usuario ha guardado en favoritos.
 * Los ids se guardan en localStorage con storage.js,
 * y las noticias se buscan en el JSON con data.js.
 */

// Esta pagina esta dentro de la carpeta pages, asi que la ruta base es "../"
const rutaBase = "../";

/**
 * obtenerNoticiasFavoritas()
 * Convierte la lista de ids guardados en una lista de noticias.
 * Si un id ya no existe en el JSON, se ignora.
 * Devuelve las noticias con la guardada mas recientemente primero.
 */
function obtenerNoticiasFavoritas() {
    var ids = obtenerFavoritos();
    var noticias = [];

    // Vamos de atras hacia delante, para que la ultima guardada salga la primera
    for (var i = ids.length - 1; i >= 0; i--) {
        var noticia = buscarNoticiaPorId(ids[i]);

        // Si esa noticia ya no esta en el JSON, nos la saltamos
        if (noticia !== null) {
            noticias.push(noticia);
        }
    }

    return noticias;
}

/**
 * mostrarFavoritos()
 * Dibuja la pagina: el contador, las cards y el aviso de "sin favoritos".
 * Si no hay noticias guardadas, muestra el mensaje y oculta "Quitar todos".
 * Si no falta ningun contenedor en el HTML, la funcion no hace nada.
 */
function mostrarFavoritos() {
    var contenedorContador = document.getElementById("favoritos-contador");
    var contenedorGrilla = document.getElementById("grilla-favoritos");
    var bloqueVacio = document.getElementById("favoritos-vacio");
    var botonQuitarTodos = document.getElementById("btn-quitar-todos");

    // Si en esta pagina falta alguno de estos elementos, no hacemos nada
    if (contenedorContador === null || contenedorGrilla === null
        || bloqueVacio === null || botonQuitarTodos === null) {
        return;
    }

    var noticias = obtenerNoticiasFavoritas();

    if (noticias.length === 0) {
        // No hay favoritos: dejamos la grilla y el contador limpios
        contenedorGrilla.innerHTML = "";
        contenedorContador.textContent = "";

        // Mostramos el aviso de "no tienes favoritos"
        bloqueVacio.removeAttribute("hidden");

        // Y escondemos el boton de "Quitar todos"
        botonQuitarTodos.setAttribute("hidden", "");
    } else {
        // Hay favoritos: escondemos el aviso
        bloqueVacio.setAttribute("hidden", "");

        // Y mostramos el boton de "Quitar todos"
        botonQuitarTodos.removeAttribute("hidden");

        // Escribimos el contador, en singular si solo hay una
        if (noticias.length === 1) {
            contenedorContador.textContent = "1 noticia guardada";
        } else {
            contenedorContador.textContent = noticias.length + " noticias guardadas";
        }

        // Pintamos las cards
        mostrarCards(noticias, "grilla-favoritos", rutaBase, "listado");
    }

    // Los marcadores de la pagina salen rellenos
    marcarFavoritosGuardados();
}

/**
 * activarEventos()
 * Escucha los clics de la pagina.
 * - Si se quita un favorito, refrescamos la lista para que desaparezca la card.
 * - Si se pulsa "Quitar todos", vaciamos todos los favoritos.
 */
function activarEventos() {
    // Quitar UN favorito
    // Un solo listener en document, como hace main.js, para que tambien
    // funcione si el clic ha caido en el SVG de dentro del boton.
    // main.js ya guarda o quita el favorito; aqui solo refrescamos la lista.
    document.addEventListener("click", function (event) {
        var botonFavorito = event.target.closest(".btn-favorito");

        if (botonFavorito !== null) {
            // Esperamos un instante para que main.js termine de cambiar el favorito
            setTimeout(function () {
                mostrarFavoritos();
            }, 0);
        }
    });

    // Quitar TODOS los favoritos
    var botonQuitarTodos = document.getElementById("btn-quitar-todos");

    // Si el boton no existe en esta pagina, no hacemos nada
    if (botonQuitarTodos === null) {
        return;
    }

    botonQuitarTodos.addEventListener("click", function () {
        // Le preguntamos al usuario antes de borrar
        if (confirm("¿Quitar todas las noticias de favoritos?")) {
            guardarFavoritos([]);
            mostrarFavoritos();
            mostrarAviso("Favoritos eliminados");
        }
    });
}

/**
 * init()
 * Espera a que se carguen los datos y despues pinta la pagina.
 * Se usa then() porque cargarDatos() devuelve una promesa.
 */
function init() {
    cargarDatos(rutaBase).then(function () {
        mostrarFavoritos();
        activarEventos();
    });
}

// Llamamos a init() para que todo empiece al cargar la pagina
init();
