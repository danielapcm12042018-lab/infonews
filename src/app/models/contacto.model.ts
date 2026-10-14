/** Datos de contacto generales del sitio (visibles en el footer y en Contacto). */
export interface ContactoInfo {
  correo: string;
  telefono: string;
  direccion: string;
  horario: string;
}

/** Mensaje enviado desde el formulario de contacto. */
export interface MensajeContacto {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
  /** Fecha de envío en formato ISO. */
  fecha: string;
}
