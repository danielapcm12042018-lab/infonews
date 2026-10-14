import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { ContactoInfo } from '../models/contacto.model';

/** Ruta servible del JSON de contacto. */
const RUTA_JSON = 'assets/data/contacto.json';

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
}
