/** Testimonio de un lector que se muestra en el Home. */
export interface Testimonio {
  id: number;
  nombre: string;
  /** Cargo o rol de la persona (por ejemplo "Profesora de secundaria"). */
  cargo: string;
  comentario: string;
  /** Opcional: nombre del archivo dentro de assets/img. */
  foto?: string;
}

/** Estructura del archivo testimonios.json. */
export interface TestimoniosData {
  testimonios: Testimonio[];
}
