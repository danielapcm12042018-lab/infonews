import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoticiaCardComponent } from '../../components/noticia-card/noticia-card.component';
import { Noticia } from '../../models/noticia.model';
import { NoticiasService } from '../../services/noticias.service';
import { ordenarNoticiasPorFecha } from '../../pipes/ordenar-por-fecha.pipe';

/** Categoría especial que muestra todas las noticias. */
const CATEGORIA_TODAS = 'Todas';

/** Milisegundos de espera antes de aplicar la búsqueda mientras se escribe. */
const ESPERA_BUSQUEDA = 300;

/** Minúsculas y sin acentos, para que "politica" encuentre "Política". */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Indica si la noticia contiene el texto en el título, la descripción o las etiquetas. */
function coincide(noticia: Noticia, textoNormalizado: string): boolean {
  const campos = [noticia.titulo, noticia.descripcion, ...noticia.tags];
  return campos.some((campo) => normalizar(campo).includes(textoNormalizado));
}

/**
 * Página de listado de noticias: filtro por categoría, buscador de texto,
 * contador de resultados y estados de carga, error y vacío. El estado vive en
 * la URL (?categoria=... y ?q=...) para que los enlaces sean compartibles.
 */
@Component({
  selector: 'app-noticias-lista',
  imports: [RouterLink, NoticiaCardComponent],
  templateUrl: './noticias-lista.component.html',
  styleUrl: './noticias-lista.component.css',
})
export class NoticiasListaComponent {
  private readonly noticiasService = inject(NoticiasService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** Categoría activa ("Todas" por defecto). */
  protected readonly categoria = signal(CATEGORIA_TODAS);

  /** Texto que se ve en el buscador (se actualiza al instante). */
  protected readonly textoBusqueda = signal('');

  /** Texto aplicado al filtrado (se actualiza tras el retardo del buscador). */
  protected readonly textoAplicado = signal('');

  /** Temporizador del retardo (debounce) del buscador. */
  private temporizador?: ReturnType<typeof setTimeout>;

  /** Categoría "Todas" más las categorías del JSON. */
  protected readonly categorias = computed(() => [
    CATEGORIA_TODAS,
    ...this.noticiasService.obtenerCategorias(),
  ]);

  /** Noticias que cumplen el filtro, ordenadas de más reciente a más antigua. */
  protected readonly noticiasFiltradas = computed<Noticia[]>(() => {
    const categoria = this.categoria();
    const texto = normalizar(this.textoAplicado());

    let resultado = this.noticiasService.obtenerTodas();

    if (categoria !== CATEGORIA_TODAS) {
      resultado = resultado.filter((noticia) => noticia.categoria === categoria);
    }

    if (texto) {
      resultado = resultado.filter((noticia) => coincide(noticia, texto));
    }

    return ordenarNoticiasPorFecha(resultado, 'desc');
  });

  /** Número de noticias que se están mostrando. */
  protected readonly total = computed(() => this.noticiasFiltradas().length);

  /** Noticias más leídas para la barra lateral. */
  protected readonly masLeidas = computed(() => this.noticiasService.obtenerMasLeidas(4));

  /** Etiquetas más repetidas de todas las noticias (temas populares). */
  protected readonly temasPopulares = computed(() => {
    const conteo = new Map<string, number>();

    for (const noticia of this.noticiasService.obtenerTodas()) {
      for (const tag of noticia.tags) {
        conteo.set(tag, (conteo.get(tag) ?? 0) + 1);
      }
    }

    return [...conteo.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  });

  /** Estado de carga y error que vienen del servicio. */
  protected readonly cargando = this.noticiasService.cargando;
  protected readonly error = this.noticiasService.error;

  constructor() {
    // Estado inicial leído de la URL (?categoria= y ?q=).
    this.route.queryParamMap.subscribe((params) => {
      const categoria = params.get('categoria') ?? CATEGORIA_TODAS;
      const texto = params.get('q') ?? '';

      if (this.categoria() !== categoria) {
        this.categoria.set(categoria);
      }
      if (this.textoAplicado() !== texto) {
        this.textoAplicado.set(texto);
        this.textoBusqueda.set(texto);
      }
    });

    // Al destruir el componente, cancelamos el temporizador pendiente.
    this.destroyRef.onDestroy(() => clearTimeout(this.temporizador));
  }

  /** Cambia la categoría activa y actualiza la URL. */
  protected cambiarCategoria(categoria: string): void {
    this.categoria.set(categoria);
    this.sincronizarUrl();
  }

  /** Guarda el texto del buscador y, tras un retardo, aplica el filtro. */
  protected alBuscar(evento: Event): void {
    const texto = (evento.target as HTMLInputElement).value;
    this.textoBusqueda.set(texto);

    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => {
      this.textoAplicado.set(texto);
      this.sincronizarUrl();
    }, ESPERA_BUSQUEDA);
  }

  /** Filtra usando una etiqueta popular como texto de búsqueda. */
  protected elegirTema(tag: string): void {
    clearTimeout(this.temporizador);
    this.textoBusqueda.set(tag);
    this.textoAplicado.set(tag);
    this.sincronizarUrl();
  }

  /** Quita todos los filtros y limpia la URL. */
  protected limpiarFiltros(): void {
    clearTimeout(this.temporizador);
    this.categoria.set(CATEGORIA_TODAS);
    this.textoBusqueda.set('');
    this.textoAplicado.set('');
    this.sincronizarUrl();
  }

  /** Pide de nuevo las noticias al servicio. */
  protected reintentar(): void {
    this.noticiasService.recargar();
  }

  /** Escribe ?categoria= y ?q= en la URL según el estado actual. */
  private sincronizarUrl(): void {
    const queryParams: Record<string, string> = {};

    if (this.categoria() !== CATEGORIA_TODAS) {
      queryParams['categoria'] = this.categoria();
    }
    if (this.textoAplicado()) {
      queryParams['q'] = this.textoAplicado();
    }

    // replaceUrl para no llenar el historial mientras se escribe.
    this.router.navigate([], { queryParams, replaceUrl: true });
  }
}
