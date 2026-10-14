import { Component, inject } from '@angular/core';
import { AvisosService } from '../../services/avisos.service';

/**
 * Muestra el aviso emergente (toast) gestionado por AvisosService.
 * Se coloca una sola vez en la aplicación (app.html).
 */
@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrl: './aviso.component.css',
})
export class AvisoComponent {
  /** Servicio con el aviso actual. */
  protected readonly avisosService = inject(AvisosService);
}
