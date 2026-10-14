import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';

/**
 * Cabecera fija con el logo, el menú de navegación, el buscador y el botón
 * hamburguesa para móvil. Muestra el número de favoritos del usuario.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly router = inject(Router);

  /** Servicio de favoritos para mostrar el contador en el menú. */
  protected readonly favoritosService = inject(FavoritosService);

  /** Estado del menú desplegable en móvil. */
  protected readonly menuAbierto = signal(false);

  /** Texto actual del buscador. */
  protected readonly textoBusqueda = signal('');

  /** Abre o cierra el menú hamburguesa. */
  protected alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  /** Cierra el menú (por ejemplo al pulsar un enlace). */
  protected cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  /** Actualiza el texto del buscador con lo que escribe el usuario. */
  protected alEscribir(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    this.textoBusqueda.set(entrada.value);
  }

  /** Envía la búsqueda al listado de noticias como parámetro de consulta. */
  protected buscar(evento: Event): void {
    evento.preventDefault();
    const texto = this.textoBusqueda().trim();
    this.cerrarMenu();
    this.router.navigate(['/noticias'], {
      queryParams: texto ? { q: texto } : {},
    });
  }
}
