import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AvisoComponent } from './components/aviso/aviso.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

/**
 * Componente raíz. Monta la cabecera, la salida del router (las páginas),
 * el pie de página y el aviso emergente global.
 */
@Component({
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AvisoComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
