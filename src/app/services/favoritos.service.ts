import { Injectable, computed, signal } from '@angular/core';

/** Clave de localStorage que ya usaba la versión anterior (se mantiene por compatibilidad). */
const CLAVE_FAVORITOS = 'infonews-favoritos';

/**
 * Gestiona las noticias favoritas del usuario.
 * Guarda únicamente una lista de ids en localStorage, igual que antes.
 */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  /** Ids favoritos guardados (estado reactivo). */
  private readonly ids = signal<number[]>(this.leer());

  /** Lista de ids favoritos (solo lectura). */
  readonly favoritos = this.ids.asReadonly();

  /** Número total de favoritos. */
  readonly total = computed(() => this.ids().length);

  /** Añade un id a favoritos si no estaba ya. */
  agregar(id: number): void {
    const idNumero = Number(id);
    if (this.ids().includes(idNumero)) {
      return;
    }
    this.ids.update((lista) => [...lista, idNumero]);
    this.guardar();
  }

  /** Quita un id de favoritos. */
  quitar(id: number): void {
    const idNumero = Number(id);
    this.ids.update((lista) => lista.filter((guardado) => guardado !== idNumero));
    this.guardar();
  }

  /**
   * Alterna un favorito.
   * Devuelve true si ha quedado guardado y false si se ha quitado.
   */
  alternar(id: number): boolean {
    if (this.esFavorito(id)) {
      this.quitar(id);
      return false;
    }
    this.agregar(id);
    return true;
  }

  /** Indica si una noticia está en favoritos. */
  esFavorito(id: number): boolean {
    return this.ids().includes(Number(id));
  }

  /** Devuelve la lista de ids favoritos. */
  obtenerFavoritos(): number[] {
    return this.ids();
  }

  /** Devuelve cuántos favoritos hay. */
  contar(): number {
    return this.ids().length;
  }

  /** Vacía toda la lista de favoritos. */
  quitarTodos(): void {
    this.ids.set([]);
    this.guardar();
  }

  /** Lee la lista guardada; si el texto está dañado devuelve un array vacío. */
  private leer(): number[] {
    try {
      const texto = localStorage.getItem(CLAVE_FAVORITOS);
      if (!texto) {
        return [];
      }
      const lista = JSON.parse(texto);
      return Array.isArray(lista) ? lista.map((id) => Number(id)) : [];
    } catch (error) {
      console.error('No se pudieron leer los favoritos:', error);
      return [];
    }
  }

  /** Guarda la lista actual en localStorage. */
  private guardar(): void {
    try {
      localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(this.ids()));
    } catch (error) {
      console.error('No se pudieron guardar los favoritos:', error);
    }
  }
}
