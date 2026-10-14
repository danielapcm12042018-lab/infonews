import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Testimonio, TestimoniosData } from '../models/testimonio.model';

/** Ruta servible del JSON de testimonios. */
const RUTA_JSON = 'assets/data/testimonios.json';

/**
 * Carga los testimonios de lectores que se muestran en la página de inicio.
 */
@Injectable({ providedIn: 'root' })
export class TestimoniosService {
  private readonly http = inject(HttpClient);

  /** Testimonios cargados (estado reactivo). */
  private readonly testimoniosSignal = signal<Testimonio[]>([]);

  /** Testimonios de solo lectura para los componentes. */
  readonly testimonios = this.testimoniosSignal.asReadonly();

  constructor() {
    this.cargar();
  }

  /** Descarga testimonios.json con HttpClient. */
  private cargar(): void {
    this.http.get<TestimoniosData>(RUTA_JSON).subscribe({
      next: (datos) => this.testimoniosSignal.set(datos.testimonios ?? []),
      error: (err) => console.error('No se pudieron cargar los testimonios:', err.message),
    });
  }
}
