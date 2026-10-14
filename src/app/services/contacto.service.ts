import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { ContactoInfo, MensajeContacto } from '../models/contacto.model';

/** Ruta servible del JSON de contacto. */
const RUTA_JSON = 'assets/data/contacto.json';

/** Clave de localStorage donde se guardan los mensajes enviados. */
const CLAVE_MENSAJES = 'infonews-mensajes';

/**
 * Carga los datos de contacto del sitio (correo, teléfono, dirección y horario).
 * Se usan en el footer y en el bloque de contacto de la página de inicio.
 */
@Injectable({ providedIn: 'root' })
export class ContactoService {
  private readonly http = inject(HttpClient);

  /** Información de contacto; null mientras carga o si falla. */
  private readonly infoSignal = signal<ContactoInfo | null>(null);

  /** Información de contacto de solo lectura para los componentes. */
  readonly info = this.infoSignal.asReadonly();

  constructor() {
    this.cargar();
  }

  /** Descarga contacto.json con HttpClient. */
  private cargar(): void {
    this.http.get<ContactoInfo>(RUTA_JSON).subscribe({
      next: (info) => this.infoSignal.set(info),
      error: (err) => console.error('No se pudo cargar la información de contacto:', err.message),
    });
  }

  /**
   * Guarda un mensaje enviado desde el formulario de contacto en localStorage.
   * No hay backend: esta lista local sirve como evidencia de la interacción.
   */
  guardarMensaje(mensaje: MensajeContacto): void {
    const lista = this.leerMensajes();
    lista.push(mensaje);

    try {
      localStorage.setItem(CLAVE_MENSAJES, JSON.stringify(lista));
    } catch (error) {
      console.error('No se pudo guardar el mensaje de contacto:', error);
    }
  }

  /** Lee la lista de mensajes guardados; si el texto está dañado devuelve una lista vacía. */
  private leerMensajes(): MensajeContacto[] {
    try {
      const texto = localStorage.getItem(CLAVE_MENSAJES);
      const lista = texto ? JSON.parse(texto) : [];
      return Array.isArray(lista) ? (lista as MensajeContacto[]) : [];
    } catch (error) {
      console.error('No se pudieron leer los mensajes de contacto:', error);
      return [];
    }
  }
}
