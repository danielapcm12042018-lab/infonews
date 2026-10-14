import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Noticia, NoticiasData } from '../../models/noticia.model';
import { NoticiasListaComponent } from './noticias-lista.component';

/** Componente vacío para poder declarar rutas de prueba (los enlaces del template). */
@Component({ selector: 'app-dummy', template: '' })
class DummyComponent {}

/** Noticia de ejemplo mínima para los tests. */
function noticiaFake(
  id: number,
  categoria: string,
  titulo: string,
  descripcion: string,
  tags: string[],
  fecha: string,
): Noticia {
  return {
    id,
    titulo,
    subtitulo: 'Sub',
    categoria,
    autor: 'Autor',
    cargoAutor: 'Cargo',
    fecha,
    lecturaMin: 1,
    visitas: id * 10,
    comentarios: 0,
    imagen: 'x.jpg',
    pieFoto: 'pie',
    descripcion,
    contenido: ['p1'],
    cita: null,
    puntosClave: [],
    tags,
    destacada: false,
  };
}

const DATOS: NoticiasData = {
  categorias: ['Salud', 'Tecnología'],
  noticias: [
    noticiaFake(1, 'Salud', 'Vacuna contra la gripe', 'Campaña de vacunación', ['salud'], '2026-01-01'),
    noticiaFake(2, 'Tecnología', 'Nuevo procesador cuántico', 'Avance en computación', ['ia', 'cuantica'], '2026-01-02'),
    noticiaFake(3, 'Salud', 'Avance en cardiología', 'Nuevos tratamientos', ['salud', 'corazon'], '2026-01-03'),
  ],
};

describe('NoticiasListaComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasListaComponent],
      providers: [
        provideRouter([
          { path: '', component: DummyComponent },
          { path: 'noticias', component: DummyComponent },
          { path: 'noticias/:id', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  /** Crea el componente y responde a la petición del JSON con los datos de prueba. */
  function crearComponente(): NoticiasListaComponent {
    const fixture = TestBed.createComponent(NoticiasListaComponent);
    httpMock.expectOne('assets/data/noticias.json').flush(DATOS);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('filtra por categoría', () => {
    const componente = crearComponente() as unknown as {
      categoria: { set: (valor: string) => void };
      noticiasFiltradas: () => Noticia[];
    };

    componente.categoria.set('Salud');

    // Ordenadas de más reciente (id 3) a más antigua (id 1).
    expect(componente.noticiasFiltradas().map((n) => n.id)).toEqual([3, 1]);
  });

  it('filtra por texto en título, descripción o etiquetas', () => {
    const componente = crearComponente() as unknown as {
      textoAplicado: { set: (valor: string) => void };
      noticiasFiltradas: () => Noticia[];
    };

    componente.textoAplicado.set('cuantico');

    expect(componente.noticiasFiltradas().map((n) => n.id)).toEqual([2]);
  });

  it('combina categoría y búsqueda, y devuelve vacío si no hay coincidencias', () => {
    const componente = crearComponente() as unknown as {
      categoria: { set: (valor: string) => void };
      textoAplicado: { set: (valor: string) => void };
      noticiasFiltradas: () => Noticia[];
    };

    componente.categoria.set('Salud');
    componente.textoAplicado.set('cardio');

    expect(componente.noticiasFiltradas().map((n) => n.id)).toEqual([3]);

    componente.textoAplicado.set('sin-resultados-xyz');

    expect(componente.noticiasFiltradas().length).toBe(0);
  });
});
