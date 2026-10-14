import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiaCardComponent } from '../../components/noticia-card/noticia-card.component';
import { Noticia } from '../../models/noticia.model';
import { AvisosService } from '../../services/avisos.service';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';

/**
 * Página de favoritos. Convierte los ids guardados en NoticiasService en
 * noticias reales, la más reciente primero, y las muestra con NoticiaCard.
 * Si un id guardado ya no existe (noticia eliminada), se ignora.
 */
@Component({
  selector: 'app-favoritos',
  imports: [RouterLink, NoticiaCardComponent],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css',
})
export class FavoritosComponent {
  private readonly noticiasService = inject(NoticiasService);
  private readonly favoritosService = inject(FavoritosService);
  private readonly avisosService = inject(AvisosService);

  /**
   * Noticias guardadas. Recorremos los ids de atrás hacia delante para que la
   * última guardada aparezca primero y descartamos los ids que ya no existen.
   */
  protected readonly favoritos = computed<Noticia[]>(() => {
    const ids = this.favoritosService.favoritos();
    const noticias: Noticia[] = [];

    for (let i = ids.length - 1; i >= 0; i--) {
      const noticia = this.noticiasService.obtenerPorId(ids[i]);
      if (noticia) {
        noticias.push(noticia);
      }
    }

    return noticias;
  });

  /** Número de noticias guardadas que todavía existen. */
  protected readonly total = computed(() => this.favoritos().length);

  /** Vacía toda la lista de favoritos, pidiendo confirmación antes. */
  protected vaciar(): void {
    if (this.favoritosService.contar() === 0) {
      return;
    }

    if (confirm('¿Quitar todas las noticias de favoritos?')) {
      this.favoritosService.quitarTodos();
      this.avisosService.mostrar('Favoritos eliminados', 'info');
    }
  }
}
