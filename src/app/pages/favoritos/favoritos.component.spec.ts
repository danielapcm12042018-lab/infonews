import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Noticia, NoticiasData } from '../../models/noticia.model';
import { FavoritosService } from '../../services/favoritos.service';
import { FavoritosComponent } from './favoritos.component';

/** Noticia de ejemplo mínima para los tests. */
function noticiaFake(id: number, titulo: string): Noticia {
  return {
    id,
    titulo,
    subtitulo: 'Sub',
    categoria: 'Política',
    autor: 'Autor',
    cargoAutor: 'Cargo',
    fecha: '2026-01-0' + id,
    lecturaMin: 1,
    visitas: 100,
    comentarios: 0,
    imagen: 'x.jpg',
    pieFoto: 'pie',
    descripcion: 'desc',
    contenido: ['p1'],
    cita: null,
    puntosClave: [],
    tags: [],
    destacada: false,
  };
}

const DATOS: NoticiasData = {
  categorias: ['Política'],
  noticias: [noticiaFake(1, 'Noticia uno'), noticiaFake(2, 'Noticia dos')],
};

describe('FavoritosComponent', () => {
  let httpMock: HttpTestingController;
  let favoritosService: FavoritosService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [FavoritosComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    favoritosService = TestBed.inject(FavoritosService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** Crea el componente y responde a la petición del JSON con los datos de prueba. */
  function crearComponente() {
    const fixture = TestBed.createComponent(FavoritosComponent);
    httpMock.expectOne('assets/data/noticias.json').flush(DATOS);
    fixture.detectChanges();
    return fixture;
  }

  it('muestra el estado vacío cuando no hay favoritos', () => {
    const fixture = crearComponente();
    expect(fixture.nativeElement.textContent).toContain('Aún no tienes noticias guardadas');
  });

  it('agrega y quita favoritos actualizando la vista al instante', () => {
    const fixture = crearComponente();

    favoritosService.agregar(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Noticia uno');

    favoritosService.quitar(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Aún no tienes noticias guardadas');
  });

  it('vacía todos los favoritos tras confirmar', () => {
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );

    const fixture = crearComponente();
    favoritosService.agregar(1);
    favoritosService.agregar(2);
    fixture.detectChanges();

    const boton = fixture.nativeElement.querySelector('button.btn-primario') as HTMLButtonElement;
    boton.click();
    fixture.detectChanges();

    expect(favoritosService.contar()).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Aún no tienes noticias guardadas');
  });

  it('ignora los ids guardados que ya no existen', () => {
    const fixture = crearComponente();

    favoritosService.agregar(9999);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aún no tienes noticias guardadas');
  });
});
