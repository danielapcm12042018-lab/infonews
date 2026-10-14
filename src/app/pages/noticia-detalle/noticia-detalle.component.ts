import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NoticiaCardComponent } from '../../components/noticia-card/noticia-card.component';
import { Noticia } from '../../models/noticia.model';
import { ordenarNoticiasPorFecha } from '../../pipes/ordenar-por-fecha.pipe';
import { AvisosService } from '../../services/avisos.service';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';

/**
 * Página de detalle de una noticia. Recibe el id por input binding de la ruta,
 * muestra el artículo completo y, si el id no existe, una vista de "no encontrada".
 */
@Component({
  selector: 'app-noticia-detalle',
  imports: [RouterLink, NoticiaCardComponent, DatePipe, DecimalPipe, UpperCasePipe],
  templateUrl: './noticia-detalle.component.html',
  styleUrl: './noticia-detalle.component.css',
})
export class NoticiaDetalleComponent {
  private readonly noticiasService = inject(NoticiasService);
  private readonly favoritosService = inject(FavoritosService);
  private readonly avisosService = inject(AvisosService);
  private readonly titleService = inject(Title);

  /** Id que llega desde la ruta "noticias/:id". */
  readonly id = input<string>('');

  /** Noticia encontrada, o undefined si el id no es válido o no existe. */
  protected readonly noticia = computed<Noticia | undefined>(() => {
    const id = Number(this.id());
    if (!Number.isInteger(id) || id <= 0) {
      return undefined;
    }
    return this.noticiasService.obtenerPorId(id);
  });

  /** Primeros párrafos; la cita y los puntos clave van después. */
  protected readonly parrafosIniciales = computed(
    () => this.noticia()?.contenido.slice(0, 2) ?? [],
  );

  /** Párrafos restantes, que se muestran al final. */
  protected readonly parrafosRestantes = computed(() => this.noticia()?.contenido.slice(2) ?? []);

  /** Noticias de la misma categoría (máximo 3), sin incluir la actual. */
  protected readonly relacionadas = computed<Noticia[]>(() => {
    const noticia = this.noticia();
    if (!noticia) {
      return [];
    }
    const mismas = this.noticiasService
      .obtenerTodas()
      .filter((otra) => otra.categoria === noticia.categoria && otra.id !== noticia.id);

    return ordenarNoticiasPorFecha(mismas, 'desc').slice(0, 3);
  });

  /** Indica si la noticia está en favoritos. */
  protected readonly esFavorito = computed(() => {
    const noticia = this.noticia();
    return noticia ? this.favoritosService.esFavorito(noticia.id) : false;
  });

  /** Estado de carga y error que vienen del servicio. */
  protected readonly cargando = this.noticiasService.cargando;
  protected readonly error = this.noticiasService.error;

  constructor() {
    // Actualiza el título de la pestaña según la noticia mostrada.
    effect(() => {
      if (this.cargando()) {
        return;
      }
      const noticia = this.noticia();
      this.titleService.setTitle(
        noticia ? `InfoNews · ${noticia.titulo}` : 'InfoNews · Noticia no encontrada',
      );
    });
  }

  /** Devuelve las iniciales de un nombre (máximo dos letras). */
  protected iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((palabra) => palabra.charAt(0).toUpperCase())
      .join('');
  }

  /** Añade o quita la noticia de favoritos y avisa al usuario. */
  protected alternarFavorito(): void {
    const noticia = this.noticia();
    if (!noticia) {
      return;
    }
    const guardado = this.favoritosService.alternar(noticia.id);
    this.avisosService.mostrar(
      guardado ? 'Añadido a favoritos' : 'Eliminado de favoritos',
      guardado ? 'exito' : 'info',
    );
  }

  /** Pide de nuevo las noticias al servicio. */
  protected reintentar(): void {
    this.noticiasService.recargar();
  }
}
