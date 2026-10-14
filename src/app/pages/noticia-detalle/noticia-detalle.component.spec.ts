import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Noticia, NoticiasData } from '../../models/noticia.model';
import { NoticiaDetalleComponent } from './noticia-detalle.component';

/** Componente vacío para declarar rutas de prueba (los enlaces del template). */
@Component({ selector: 'app-dummy', template: '' })
class DummyComponent {}

/** Noticia de ejemplo mínima para los tests. */
function noticiaFake(id: number, titulo: string): Noticia {
  return {
    id,
    titulo,
    subtitulo: 'Sub',
    categoria: 'Salud',
    autor: 'Ana López',
    cargoAutor: 'Redactora',
    fecha: '2026-01-01',
    lecturaMin: 3,
    visitas: 100,
    comentarios: 2,
    imagen: 'x.jpg',
    pieFoto: 'pie',
    descripcion: 'desc',
    contenido: ['p1', 'p2', 'p3'],
    cita: null,
    puntosClave: [],
    tags: ['salud'],
    destacada: false,
  };
}

const DATOS: NoticiasData = {
  categorias: ['Salud'],
  noticias: [noticiaFake(1, 'Noticia de prueba'), noticiaFake(2, 'Otra noticia')],
};

describe('NoticiaDetalleComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiaDetalleComponent],
      providers: [
        { provide: Title, useValue: { setTitle: () => {} } },
        provideRouter([
          { path: '', component: DummyComponent },
          { path: 'noticias', component: DummyComponent },
          { path: 'noticias/:id', component: DummyComponent },
          { path: 'contacto', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  /** Crea el componente con un id y responde a la petición del JSON. */
  function crearComponente(id: string) {
    const fixture = TestBed.createComponent(NoticiaDetalleComponent);
    httpMock.expectOne('assets/data/noticias.json').flush(DATOS);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    return fixture;
  }

  it('muestra la noticia cuando el id existe', () => {
    const fixture = crearComponente('1');
    expect(fixture.nativeElement.textContent).toContain('Noticia de prueba');
  });

  it('muestra "Noticia no encontrada" cuando el id no existe', () => {
    const fixture = crearComponente('9999');
    expect(fixture.nativeElement.textContent).toContain('Noticia no encontrada');
  });

  it('muestra "Noticia no encontrada" cuando el id no es un número', () => {
    const fixture = crearComponente('abc');
    expect(fixture.nativeElement.textContent).toContain('Noticia no encontrada');
  });
});
