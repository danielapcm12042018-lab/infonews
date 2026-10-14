import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoticiaCardComponent } from '../../components/noticia-card/noticia-card.component';
import { ContactoService } from '../../services/contacto.service';
import { NoticiasService } from '../../services/noticias.service';
import { TestimoniosService } from '../../services/testimonios.service';

/**
 * Página de inicio. Reúne las noticias destacadas, las más leídas, las
 * categorías, los testimonios y los datos de contacto.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, NoticiaCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly noticiasService = inject(NoticiasService);
  private readonly testimoniosService = inject(TestimoniosService);

  /** Información de contacto del sitio. */
  protected readonly contactoService = inject(ContactoService);

  /** Noticias destacadas (reactivo a los cambios del servicio). */
  protected readonly destacadas = computed(() => this.noticiasService.obtenerDestacadas());

  /** Noticias más leídas por número de visitas. */
  protected readonly masLeidas = computed(() => this.noticiasService.obtenerMasLeidas());

  /** Categorías con el número de artículos de cada una. */
  protected readonly categorias = computed(() => this.noticiasService.obtenerCategoriasConConteo());

  /** Testimonios de lectores. */
  protected readonly testimonios = this.testimoniosService.testimonios;

  /** Estado de carga de las noticias. */
  protected readonly cargando = this.noticiasService.cargando;

  /** Devuelve las iniciales de un nombre (máximo dos letras). */
  protected iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((palabra) => palabra.charAt(0).toUpperCase())
      .join('');
  }
}
