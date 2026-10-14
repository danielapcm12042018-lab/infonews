/**
 * Modelos de datos de las noticias.
 * Los campos coinciden exactamente con los que ya usa assets/data/noticias.json.
 */

/** Cita textual que puede acompañar al cuerpo de una noticia. */
export interface Cita {
  texto: string;
  autor: string;
}

/** Noticia individual tal y como viene en noticias.json. */
export interface Noticia {
  id: number;
  titulo: string;
  subtitulo: string;
  categoria: string;
  autor: string;
  cargoAutor: string;
  /** Fecha en formato "AAAA-MM-DD". */
  fecha: string;
  lecturaMin: number;
  visitas: number;
  comentarios: number;
  /** Nombre del archivo dentro de assets/img. */
  imagen: string;
  pieFoto: string;
  descripcion: string;
  /** Cuerpo de la noticia separado en párrafos. */
  contenido: string[];
  cita: Cita | null;
  puntosClave: string[];
  tags: string[];
  destacada: boolean;
}

/** Estructura completa del archivo noticias.json. */
export interface NoticiasData {
  /** Fuente única de verdad de las categorías (la usan filtros y "explorar"). */
  categorias: string[];
  noticias: Noticia[];
}

/** Categoría junto al número de noticias que tiene. */
export interface CategoriaConConteo {
  nombre: string;
  articulos: number;
}
