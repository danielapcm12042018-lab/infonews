import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Noticia, NoticiasData } from '../../models/noticia.model';
import { NoticiasService } from '../../services/noticias.service';
import { GestionarComponent } from './gestionar.component';

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
    imagen: 'detallen.jpg',
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
  categorias: ['Política', 'Economía'],
  noticias: [noticiaFake(1, 'Noticia uno'), noticiaFake(2, 'Noticia dos')],
};

/** Vista parcial y tipada del componente para los tests. */
interface GestionarAccesible {
  formulario: {
    invalid: boolean;
    controls: Record<string, { setValue: (v: string) => void }>;
  };
  enviar: () => void;
  eliminar: (noticia: Noticia) => void;
  restablecer: () => void;
}

describe('GestionarComponent', () => {
  let httpMock: HttpTestingController;
  let noticiasService: NoticiasService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [GestionarComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    noticiasService = TestBed.inject(NoticiasService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** Crea el componente y responde a la petición del JSON con los datos de prueba. */
  function crearComponente(): ComponentFixture<GestionarComponent> {
    const fixture = TestBed.createComponent(GestionarComponent);
    httpMock.expectOne('assets/data/noticias.json').flush(DATOS);
    fixture.detectChanges();
    return fixture;
  }

  function componente(fixture: ComponentFixture<GestionarComponent>): GestionarAccesible {
    return fixture.componentInstance as unknown as GestionarAccesible;
  }

  /** Rellena el formulario con datos válidos. */
  function rellenarFormulario(comp: GestionarAccesible): void {
    comp.formulario.controls['titulo'].setValue('Un título de prueba');
    comp.formulario.controls['categoria'].setValue('Política');
    comp.formulario.controls['autor'].setValue('Ana López');
    comp.formulario.controls['imagen'].setValue('detallen.jpg');
    comp.formulario.controls['descripcion'].setValue('Una descripción breve válida.');
    comp.formulario.controls['contenido'].setValue(
      'Este es un contenido lo bastante largo para superar la validación mínima de cincuenta caracteres.',
    );
  }

  it('el formulario es inválido al inicio', () => {
    const comp = componente(crearComponente());
    expect(comp.formulario.invalid).toBe(true);
  });

  it('muestra el contador de caracteres de la descripción', () => {
    const fixture = crearComponente();
    const comp = componente(fixture);

    comp.formulario.controls['descripcion'].setValue('12345');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('5/160');
  });

  it('no crea la noticia si el formulario es inválido', () => {
    const fixture = crearComponente();
    const comp = componente(fixture);

    comp.formulario.controls['titulo'].setValue('abc');
    comp.enviar();
    fixture.detectChanges();

    expect(noticiasService.obtenerTodas().length).toBe(2);
  });

  it('crea una noticia válida y la añade al listado', () => {
    const fixture = crearComponente();
    const comp = componente(fixture);

    rellenarFormulario(comp);
    comp.enviar();
    fixture.detectChanges();

    const creada = noticiasService.obtenerTodas().find((n) => n.titulo === 'Un título de prueba');
    expect(creada).toBeTruthy();
    expect(noticiasService.obtenerPorId(creada!.id)?.titulo).toBe('Un título de prueba');
    expect(noticiasService.esCreada(creada!.id)).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Un título de prueba');
    expect(fixture.nativeElement.textContent).toContain('Creada por ti');
  });

  it('elimina una noticia tras confirmar', () => {
    vi.stubGlobal('confirm', vi.fn(() => true));

    const fixture = crearComponente();
    const comp = componente(fixture);

    comp.eliminar(noticiasService.obtenerPorId(1)!);
    fixture.detectChanges();

    expect(noticiasService.obtenerPorId(1)).toBeUndefined();
    expect(fixture.nativeElement.textContent).not.toContain('Noticia uno');
  });

  it('restablece el listado original tras confirmar', () => {
    vi.stubGlobal('confirm', vi.fn(() => true));

    const fixture = crearComponente();
    const comp = componente(fixture);

    rellenarFormulario(comp);
    comp.enviar();
    fixture.detectChanges();
    expect(noticiasService.obtenerTodas().length).toBe(3);

    comp.restablecer();
    fixture.detectChanges();

    expect(noticiasService.obtenerTodas().length).toBe(2);
    expect(fixture.nativeElement.textContent).not.toContain('Un título de prueba');
  });
});
