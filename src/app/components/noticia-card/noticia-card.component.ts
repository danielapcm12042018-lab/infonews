import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../models/noticia.model';
import { AvisosService } from '../../services/avisos.service';
import { FavoritosService } from '../../services/favoritos.service';

/**
 * Tarjeta de noticia reutilizable. Recibe la noticia por input y permite
 * guardarla en favoritos o abrir su detalle.
 */
@Component({
  selector: 'app-noticia-card',
  imports: [RouterLink],
  templateUrl: './noticia-card.component.html',
  styleUrl: './noticia-card.component.css',
})
export class NoticiaCardComponent {
  private readonly favoritosService = inject(FavoritosService);
  private readonly avisosService = inject(AvisosService);

  /** Noticia que muestra la tarjeta (obligatoria). */
  readonly noticia = input.required<Noticia>();

  /** Muestra un botón de texto "Quitar" en lugar del marcador (página de favoritos). */
  readonly mostrarQuitar = input(false);

  /** Variante visual de la tarjeta: "normal" o "listado" (sin fondo, con línea inferior). */
  readonly variante = input<'normal' | 'listado'>('normal');

  /** Indica si la noticia está en favoritos (se recalcula al cambiar los favoritos). */
  protected readonly esFavorito = computed(() =>
    this.favoritosService.esFavorito(this.noticia().id),
  );

  /** Añade o quita la noticia de favoritos y avisa al usuario. */
  protected alternarFavorito(): void {
    const guardado = this.favoritosService.alternar(this.noticia().id);
    this.avisosService.mostrar(
      guardado ? 'Añadido a favoritos' : 'Eliminado de favoritos',
      guardado ? 'exito' : 'info',
    );
  }

  /** Quita la noticia de favoritos y avisa al usuario (botón "Quitar"). */
  protected quitarFavorito(): void {
    this.favoritosService.quitar(this.noticia().id);
    this.avisosService.mostrar('Eliminado de favoritos', 'info');
  }
}
