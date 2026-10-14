import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContactoInfo } from '../../models/contacto.model';
import { ContactoComponent } from './contacto.component';

const CONTACTO: ContactoInfo = {
  correo: 'redaccion@infonews.com',
  telefono: '+34 910 000 000',
  direccion: 'Calle de la Prensa, 42. 28001 Madrid, España',
  horario: 'Lunes a Viernes: 08:00 - 20:00 (CET)',
};

describe('ContactoComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ContactoComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  /** Crea el componente y responde a la petición del JSON de contacto. */
  function crearComponente() {
    const fixture = TestBed.createComponent(ContactoComponent);
    httpMock.expectOne('assets/data/contacto.json').flush(CONTACTO);
    fixture.detectChanges();
    return fixture;
  }

  it('el formulario es inválido al inicio', () => {
    const fixture = crearComponente();
    const componente = fixture.componentInstance as unknown as {
      formulario: { invalid: boolean };
    };

    expect(componente.formulario.invalid).toBe(true);
  });

  it('un correo con formato incorrecto muestra el error', () => {
    const fixture = crearComponente();
    const componente = fixture.componentInstance as unknown as {
      formulario: {
        controls: { correo: { setValue: (v: string) => void; markAsTouched: () => void } };
      };
    };

    componente.formulario.controls.correo.setValue('no-es-un-correo');
    componente.formulario.controls.correo.markAsTouched();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Introduce un correo electrónico válido.');
  });

  it('un formulario válido se envía y muestra la confirmación', () => {
    const fixture = crearComponente();
    const componente = fixture.componentInstance as unknown as {
      formulario: {
        controls: Record<string, { setValue: (v: string) => void }>;
        value: Record<string, string>;
      };
      enviar: () => void;
    };

    componente.formulario.controls['nombre'].setValue('Ana López');
    componente.formulario.controls['correo'].setValue('ana@ejemplo.com');
    componente.formulario.controls['asunto'].setValue('Consulta');
    componente.formulario.controls['mensaje'].setValue('Este es un mensaje de prueba.');
    fixture.detectChanges();

    componente.enviar();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('¡Mensaje enviado!');
    expect(fixture.nativeElement.textContent).toContain('Ana López');
    expect(componente.formulario.value['nombre']).toBe('');

    const guardados = JSON.parse(localStorage.getItem('infonews-mensajes') ?? '[]');
    expect(guardados.length).toBe(1);
    expect(guardados[0].nombre).toBe('Ana López');
  });

  it('prellena el asunto desde el query param', () => {
    const fixture = crearComponente();
    const componente = fixture.componentInstance as unknown as {
      formulario: { controls: { asunto: { value: string } } };
    };

    fixture.componentRef.setInput('asunto', 'Consulta sobre: una noticia');
    fixture.detectChanges();

    expect(componente.formulario.controls.asunto.value).toBe('Consulta sobre: una noticia');
  });
});
