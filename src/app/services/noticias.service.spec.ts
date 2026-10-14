import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Noticia, NoticiasData } from '../models/noticia.model';
import { NoticiasService } from './noticias.service';

/** Noticia de ejemplo mínima para los tests. */
function noticiaFake(id: number, visitas: number, destacada: boolean): Noticia {
  return {
    id,
    titulo: 'Titulo ' + id,
    subtitulo: 'Sub',
    categoria: 'Política',
    autor: 'Autor',
    cargoAutor: 'Cargo',
    fecha: '2026-01-0' + id,
    lecturaMin: 1,
    visitas,
    comentarios: 0,
    imagen: 'x.jpg',
    pieFoto: 'pie',
    descripcion: 'desc',
    contenido: ['p1'],
    cita: null,
    puntosClave: [],
    tags: [],
    destacada,
  };
}

describe('NoticiasService', () => {
  let service: NoticiasService;
  let httpMock: HttpTestingController;

  const datos: NoticiasData = {
    categorias: ['Política', 'Deportes'],
    noticias: [noticiaFake(1, 100, true), noticiaFake(2, 500, false)],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(NoticiasService);
    httpMock = TestBed.inject(HttpTestingController);

    // La carga arranca en el constructor: respondemos con los datos de prueba.
    httpMock.expectOne('assets/data/noticias.json').flush(datos);
  });

  it('carga el JSON y expone noticias y categorías', () => {
    expect(service.obtenerTodas().length).toBe(2);
    expect(service.obtenerCategorias()).toContain('Política');
  });

  it('obtenerPorId devuelve la noticia correcta', () => {
    expect(service.obtenerPorId(2)?.id).toBe(2);
  });

  it('obtenerDestacadas filtra solo las destacadas', () => {
    expect(service.obtenerDestacadas().map((n) => n.id)).toEqual([1]);
  });

  it('obtenerMasLeidas ordena por visitas de mayor a menor', () => {
    expect(service.obtenerMasLeidas().map((n) => n.id)).toEqual([2, 1]);
  });
});
