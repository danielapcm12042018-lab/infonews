import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvisosService } from '../../services/avisos.service';
import { ContactoService } from '../../services/contacto.service';

/** Año actual para el aviso de copyright. */
const ANIO_ACTUAL = new Date().getFullYear();

/**
 * Pie de página con información general, datos de contacto, navegación,
 * redes sociales y enlaces legales.
 */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private readonly avisosService = inject(AvisosService);

  /** Información de contacto del sitio (correo, teléfono, dirección, horario). */
  protected readonly contactoService = inject(ContactoService);

  /** Año mostrado en el copyright. */
  protected readonly anio = ANIO_ACTUAL;

  /** Avisa de que los documentos legales no están disponibles todavía. */
  protected mostrarAviso(documento: string): void {
    this.avisosService.mostrar(`${documento}: documento disponible próximamente.`, 'info');
  }
}
