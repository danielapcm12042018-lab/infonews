/**
 * data.js
 * Lee el archivo assets/data/noticias.json y ofrece funciones sencillas
 * para consultarlo. Todas las demas paginas usan estas funciones en vez de
 * abrir el JSON por su cuenta.
 */

// Variable global donde se guarda el JSON ya leido.
// Empieza en null porque todavia no hemos cargado nada.
let datosNoticias = null;

/**
 * cargarDatos(rutaBase)
 * Descarga el archivo noticias.json usando fetch y guarda el resultado
 * en la variable global datosNoticias.
 * rutaBase: "" si la pagina esta en la raiz, "../" si esta dentro de pages/.
 * Devuelve la promesa, para que otras paginas puedan encadenar:
 * cargarDatos(rutaBase).then(...)
 * Si la descarga falla avisa por consola y devuelve un objeto vacio,
 * para que la pagina pueda seguir funcionando sin noticias.
 */
function cargarDatos(rutaBase) {
    return fetch(rutaBase + "assets/data/noticias.json")
        .then(function (respuesta) {
            // Convertimos la respuesta del servidor en un objeto JavaScript
            return respuesta.json();
        })
        .then(function (datos) {
            // Guardamos el JSON leido para que el resto de funciones lo usen
            datosNoticias = datos;
            return datos;
        })
        .catch(function (error) {
            console.error("No se pudo cargar el archivo de noticias: " + error.message);

            // Datos vacios para que las demas funciones no den error
            var datosVacios = { categorias: [], noticias: [] };
            datosNoticias = datosVacios;
            return datosVacios;
        });
}

/**
 * obtenerNoticiasDelJson()
 * Devuelve las noticias que vienen del archivo JSON, sin quitar ni añadir nada.
 * Si el archivo aun no se ha cargado devuelve un array vacio.
 */
function obtenerNoticiasDelJson() {
    if (datosNoticias === null) {
        return [];
    }
    return datosNoticias.noticias;
}

/**
 * obtenerNoticias()
 * Devuelve el array de noticias que se debe mostrar en la pagina.
 * Une las noticias creadas por el usuario con las del JSON
 * y quita las que el usuario haya eliminado.
 * Si no hay datos devuelve un array vacio.
 */
function obtenerNoticias() {
    // Primero las creadas por el usuario, despues las del JSON
    var todas = obtenerNoticiasCreadas().concat(obtenerNoticiasDelJson());

    // Los ids eliminados no se muestran
    var idsEliminados = obtenerIdsEliminados();

    return todas.filter(function (noticia) {
        return idsEliminados.includes(noticia.id) === false;
    });
}

/**
 * obtenerCategorias()
 * Devuelve el array de categorias (Mundo, Economia, Ciencia, ...).
 * Si el archivo aun no se ha cargado devuelve un array vacio.
 */
function obtenerCategorias() {
    if (datosNoticias === null) {
        return [];
    }
    return datosNoticias.categorias;
}

/**
 * buscarNoticiaPorId(id)
 * Busca una noticia por su id y la devuelve.
 * El id puede llegar como texto desde la URL, por eso se convierte con Number().
 * Si no encuentra ninguna devuelve null.
 */
function buscarNoticiaPorId(id) {
    // Convertimos el id a numero para compararlo con el id del JSON
    var idNumero = Number(id);

    // find() devuelve el primer elemento que cumple la condicion, o undefined
    var noticia = obtenerNoticias().find(function (noticia) {
        return noticia.id === idNumero;
    });

    // undefined no se puede usar, por eso lo cambiamos por null
    return noticia || null;
}

/**
 * filtrarPorCategoria(categoria)
 * Devuelve las noticias de la categoria indicada.
 * Si la categoria es "Todas" devuelve todas las noticias.
 */
function filtrarPorCategoria(categoria) {
    var noticias = obtenerNoticias();

    // "Todas" es la opcion que muestra el listado completo
    if (categoria === "Todas") {
        return noticias;
    }

    // filter() crea un array nuevo, asi que el original no se modifica
    return noticias.filter(function (noticia) {
        return noticia.categoria === categoria;
    });
}

/**
 * buscarPorTexto(texto)
 * Devuelve las noticias cuyo titulo o descripcion contienen el texto buscado.
 * No importa si el texto va en mayusculas o en minusculas.
 */
function buscarPorTexto(texto) {
    // Pasamos el texto a minusculas para poder comparar sin problemas
    var busqueda = texto.toLowerCase();

    return obtenerNoticias().filter(function (noticia) {
        var titulo = noticia.titulo.toLowerCase();
        var descripcion = noticia.descripcion.toLowerCase();

        // Con includes() comprobamos si un texto esta dentro de otro
        return titulo.includes(busqueda) || descripcion.includes(busqueda);
    });
}

/**
 * obtenerDestacadas()
 * Devuelve las noticias marcadas como destacadas (destacada: true).
 */
function obtenerDestacadas() {
    return obtenerNoticias().filter(function (noticia) {
        return noticia.destacada === true;
    });
}

/**
 * obtenerMasLeidas(cantidad)
 * Devuelve las noticias mas leidas, ordenadas de mas visitas a menos.
 * Usa slice() para copiar el array antes de ordenarlo y no tocar el original.
 */
function obtenerMasLeidas(cantidad) {
    // Copia del array original, aqui si podemos ordenar sin miedo
    var copia = obtenerNoticias().slice();

    // Restar visitas de forma descendente: primero la que mas visitas tiene
    copia.sort(function (a, b) {
        return b.visitas - a.visitas;
    });

    // slice(0, cantidad) deja solo las primeras "cantidad" noticias
    return copia.slice(0, cantidad);
}

/**
 * obtenerRelacionadas(noticiaActual, cantidad)
 * Devuelve hasta "cantidad" noticias parecidas a la que se esta viendo.
 * Empieza por las de la misma categoria, sin incluir la noticia actual.
 * Si no hay suficientes, completa con otras noticias distintas.
 */
function obtenerRelacionadas(noticiaActual, cantidad) {
    var noticias = obtenerNoticias();

    // Noticias de la misma categoria, pero sin la que estamos viendo
    var relacionadas = noticias.filter(function (noticia) {
        return noticia.id !== noticiaActual.id &&
            noticia.categoria === noticiaActual.categoria;
    });

    // Si no hay suficientes, añadimos otras noticias que no esten repetidas
    if (relacionadas.length < cantidad) {
        var otras = noticias.filter(function (noticia) {
            return noticia.id !== noticiaActual.id &&
                relacionadas.indexOf(noticia) === -1;
        });

        // concat() une los dos arrays en uno nuevo
        relacionadas = relacionadas.concat(otras);
    }

    // Devolvemos solo las que pedimos
    return relacionadas.slice(0, cantidad);
}

/**
 * obtenerUltimas(cantidad)
 * Devuelve las noticias mas recientes, de la fecha mas nueva a la mas antigua.
 * Las fechas "AAAA-MM-DD" se pueden comparar como texto.
 * Usa slice() para copiar el array antes de ordenarlo y no tocar el original.
 */
function obtenerUltimas(cantidad) {
    // Copia del array original, aqui si podemos ordenar sin miedo
    var copia = obtenerNoticias().slice();

    // Ordenamos comparando el texto de las fechas
    copia.sort(function (a, b) {
        if (a.fecha < b.fecha) {
            return -1;
        }
        if (a.fecha > b.fecha) {
            return 1;
        }
        return 0;
    });

    return copia.slice(0, cantidad);
}

/**
 * generarNuevoId()
 * Devuelve un id nuevo que no choque con ninguno existente.
 * Mira los ids del JSON y los de las noticias creadas y devuelve el mayor + 1.
 * Los eliminados se ignoran, asi no se reutilizan sus ids.
 */
function generarNuevoId() {
    var delJson = obtenerNoticiasDelJson();
    var creadas = obtenerNoticiasCreadas();

    // Empezamos en cero, asi con la lista vacia el primer id es el uno
    var mayor = 0;

    for (var i = 0; i < delJson.length; i++) {
        if (delJson[i].id > mayor) {
            mayor = delJson[i].id;
        }
    }

    for (var j = 0; j < creadas.length; j++) {
        if (creadas[j].id > mayor) {
            mayor = creadas[j].id;
        }
    }

    return mayor + 1;
}
