import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { CategoriaConConteo, Noticia, NoticiasData } from '../models/noticia.model';
import { ordenarNoticiasPorFecha } from '../pipes/ordenar-por-fecha.pipe';
import { FavoritosService } from './favoritos.service';

/** Claves de localStorage (se mantienen las de la versión anterior). */
const CLAVE_NOTICIAS_CREADAS = 'infonews-noticias-creadas';
const CLAVE_NOTICIAS_ELIMINADAS = 'infonews-noticias-eliminadas';

/** Ruta servible del JSON de noticias. */
const RUTA_JSON = 'assets/data/noticias.json';

/**
 * Fuente única de datos de noticias.
 * Carga el JSON con HttpClient y lo combina con las noticias creadas por el
 * usuario y descuenta las eliminadas (ambas persistidas en localStorage).
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);
  private readonly favoritosService = inject(FavoritosService);

  /** Noticias que vienen del JSON. */
  private readonly noticiasJson = signal<Noticia[]>([]);

  /** Noticias creadas por el usuario. */
  private readonly noticiasCreadas = signal<Noticia[]>([]);

  /** Ids de noticias del JSON que el usuario ha eliminado. */
  private readonly noticiasEliminadas = signal<number[]>([]);

  /** Categorías; única fuente de verdad del JSON. */
  private readonly categoriasJson = signal<string[]>([]);

  /** Estado de carga y error (para la UI). */
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  /** Lista final: creadas + JSON, sin las eliminadas. */
  readonly noticias = computed<Noticia[]>(() => {
    const eliminadas = this.noticiasEliminadas();
    return [...this.noticiasCreadas(), ...this.noticiasJson()].filter(
      (noticia) => !eliminadas.includes(noticia.id),
    );
  });

  constructor() {
    // Recuperamos lo guardado y pedimos el JSON al arrancar.
    this.noticiasCreadas.set(this.leerLocalStorage<Noticia[]>(CLAVE_NOTICIAS_CREADAS, []));
    this.noticiasEliminadas.set(this.leerLocalStorage<number[]>(CLAVE_NOTICIAS_ELIMINADAS, []));
    this.cargar();
  }

  /** Descarga noticias.json con HttpClient y rellena los signals. */
  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.http.get<NoticiasData>(RUTA_JSON).subscribe({
      next: (datos) => {
        this.categoriasJson.set(datos.categorias ?? []);
        this.noticiasJson.set(datos.noticias ?? []);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('No se pudieron cargar las noticias: ' + err.message);
        this.cargando.set(false);
      },
    });
  }

  /** Vuelve a descargar noticias.json (botón "Reintentar" de la interfaz). */
  recargar(): void {
    this.cargar();
  }

  /** Todas las noticias visibles (sin ordenar). */
  obtenerTodas(): Noticia[] {
    return this.noticias();
  }

  /** Noticia por id, o undefined si no existe. */
  obtenerPorId(id: number | string): Noticia | undefined {
    const idNumero = Number(id);
    return this.noticias().find((noticia) => noticia.id === idNumero);
  }

  /** Noticias marcadas como destacadas. */
  obtenerDestacadas(): Noticia[] {
    return this.noticias().filter((noticia) => noticia.destacada);
  }

  /** Noticias más leídas, ordenadas de más a menos visitas. */
  obtenerMasLeidas(cantidad = 4): Noticia[] {
    return [...this.noticias()].sort((a, b) => b.visitas - a.visitas).slice(0, cantidad);
  }

  /** Noticias de una categoría. "Todas" devuelve el listado completo. */
  obtenerPorCategoria(categoria: string): Noticia[] {
    if (!categoria || categoria === 'Todas') {
      return this.noticias();
    }
    return this.noticias().filter((noticia) => noticia.categoria === categoria);
  }

  /** Lista de categorías (única fuente de verdad). */
  obtenerCategorias(): string[] {
    return this.categoriasJson();
  }

  /** Categorías con el número de noticias reales (para "explorar categorías"). */
  obtenerCategoriasConConteo(): CategoriaConConteo[] {
    const todas = this.noticias();
    return this.obtenerCategorias().map((nombre) => ({
      nombre,
      articulos: todas.filter((noticia) => noticia.categoria === nombre).length,
    }));
  }

  /** Últimas noticias ordenadas por fecha (usa el helper único de orden). */
  obtenerUltimas(cantidad = 12): Noticia[] {
    return ordenarNoticiasPorFecha(this.noticias(), 'desc').slice(0, cantidad);
  }

  // --- CRUD (estructura preparada; la interfaz se añadirá más adelante) ---

  /** Crea una noticia, la persiste en localStorage y la añade a la lista. */
  crearNoticia(datos: Omit<Noticia, 'id'>): Noticia {
    const nueva: Noticia = { ...datos, id: this.generarNuevoId() };
    this.noticiasCreadas.update((lista) => [nueva, ...lista]);
    this.guardarLocalStorage(CLAVE_NOTICIAS_CREADAS, this.noticiasCreadas());
    return nueva;
  }

  /** Elimina una noticia (creada o del JSON) y también la quita de favoritos. */
  eliminarNoticia(id: number): void {
    const idNumero = Number(id);
    const esCreada = this.noticiasCreadas().some((noticia) => noticia.id === idNumero);

    if (esCreada) {
      this.noticiasCreadas.update((lista) => lista.filter((noticia) => noticia.id !== idNumero));
      this.guardarLocalStorage(CLAVE_NOTICIAS_CREADAS, this.noticiasCreadas());
    } else {
      this.noticiasEliminadas.update((ids) =>
        ids.includes(idNumero) ? ids : [...ids, idNumero],
      );
      this.guardarLocalStorage(CLAVE_NOTICIAS_ELIMINADAS, this.noticiasEliminadas());
    }

    this.favoritosService.quitar(idNumero);
  }

  /** Vuelve al listado original del JSON (borra creadas y eliminadas). */
  restablecer(): void {
    this.noticiasCreadas.set([]);
    this.noticiasEliminadas.set([]);
    try {
      localStorage.removeItem(CLAVE_NOTICIAS_CREADAS);
      localStorage.removeItem(CLAVE_NOTICIAS_ELIMINADAS);
    } catch (error) {
      console.error('No se pudieron restablecer las noticias:', error);
    }
  }

  /** Devuelve un id nuevo que no choque con los existentes. */
  private generarNuevoId(): number {
    const ids = this.noticias().map((noticia) => noticia.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  /** Lee y parsea una clave de localStorage, con valor por defecto si falla. */
  private leerLocalStorage<T>(clave: string, porDefecto: T): T {
    try {
      const texto = localStorage.getItem(clave);
      return texto ? (JSON.parse(texto) as T) : porDefecto;
    } catch (error) {
      console.error(`No se pudo leer "${clave}" de localStorage:`, error);
      return porDefecto;
    }
  }

  /** Guarda un valor en localStorage serializado como JSON. */
  private guardarLocalStorage(clave: string, valor: unknown): void {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
      console.error(`No se pudo guardar "${clave}" en localStorage:`, error);
    }
  }
}
