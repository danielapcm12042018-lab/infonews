import { Injectable, signal } from '@angular/core';

/** Tipos de aviso que puede mostrar la interfaz. */
export type TipoAviso = 'info' | 'exito' | 'error';

/** Aviso emergente (toast). */
export interface Aviso {
  mensaje: string;
  tipo: TipoAviso;
}

/**
 * Servicio de avisos que sustituye a la función global mostrarAviso() de main.js.
 * El componente visual que lo muestre se añadirá en un paso posterior;
 * aquí solo se gestiona el estado y el temporizador.
 */
@Injectable({ providedIn: 'root' })
export class AvisosService {
  /** Aviso actual; null cuando no hay ninguno visible. */
  readonly aviso = signal<Aviso | null>(null);

  /** Temporizador para ocultar el aviso automáticamente. */
  private temporizador?: ReturnType<typeof setTimeout>;

  /** Muestra un aviso durante `duracion` ms (2000 por defecto). */
  mostrar(mensaje: string, tipo: TipoAviso = 'info', duracion = 2000): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
    }

    this.aviso.set({ mensaje, tipo });
    this.temporizador = setTimeout(() => this.ocultar(), duracion);
  }

  /** Oculta el aviso actual. */
  ocultar(): void {
    this.aviso.set(null);
  }
}
