import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Página 404 para rutas inexistentes. */
@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink],
  template: `
    <section class="contenedor no-encontrado">
      <h1>404</h1>
      <p>La página que buscas no existe o se ha movido.</p>
      <a class="btn btn-primario" routerLink="/">Volver al inicio</a>
    </section>
  `,
  styles: `
    .no-encontrado {
      text-align: center;
      padding-top: 80px;
      padding-bottom: 80px;
    }

    .no-encontrado h1 {
      font-size: 5rem;
      color: var(--color-primario);
      margin-bottom: 8px;
    }

    .no-encontrado p {
      color: var(--color-texto-suave);
      margin-bottom: 24px;
    }
  `,
})
export class NoEncontradoComponent {}
