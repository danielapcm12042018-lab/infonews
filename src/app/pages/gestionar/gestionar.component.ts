import { DatePipe } from '@angular/common';
import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../models/noticia.model';
import { ordenarNoticiasPorFecha } from '../../pipes/ordenar-por-fecha.pipe';
import { AvisosService } from '../../services/avisos.service';
import { NoticiasService } from '../../services/noticias.service';

/** Campos del formulario de creación. */
type CampoNoticia =
  'titulo' | 'subtitulo' | 'categoria' | 'autor' | 'imagen' | 'descripcion' | 'contenido';

/**
 * Página de gestión de noticias (mini CRUD). Permite crear noticias con un
 * formulario reactivo, listarlas y eliminarlas, y restablecer los datos
 * originales. Como no hay backend, las altas y bajas se guardan en
 * localStorage a través de NoticiasService.
 */
@Component({
  selector: 'app-gestionar',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './gestionar.component.html',
  styleUrl: './gestionar.component.css',
})
export class GestionarComponent {
  private readonly fb = inject(FormBuilder);
  private readonly noticiasService = inject(NoticiasService);
  private readonly avisosService = inject(AvisosService);

  /** Imágenes disponibles en public/assets/img (lista fija). */
  protected readonly imagenes = [
    'contacto.jpg',
    'detallen.jpg',
    'h_internacional.jpg',
    'h_salud.jpg',
    'hn_ciencia.jpg',
    'hn_cultura.jpg',
    'hn_economia_finanzas.jpg',
    'hn_sociedad_tecnologia.jpg',
    'hn_sostenibilidad_ambiente.jpg',
    'meroro.jpg',
    'n_tecnologia.jpg',
    'tensionp.jpg',
    'viajes.jpg',
  ];

  /** Referencia al formulario para llevar el foco al primer campo con error. */
  private readonly formularioRef = viewChild<ElementRef<HTMLFormElement>>('formularioNoticia');

  /** Formulario reactivo de creación de noticias. */
  protected readonly formulario = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    subtitulo: [''],
    categoria: ['', [Validators.required]],
    autor: ['', [Validators.required]],
    imagen: ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(160)]],
    contenido: ['', [Validators.required, Validators.minLength(50)]],
  });

  /** Nº de caracteres escritos en la descripción (contador de la interfaz). */
  protected readonly descripcionLongitud = toSignal(
    this.formulario.controls.descripcion.valueChanges,
    { initialValue: '' },
  );

  /** Imagen elegida para la vista previa. */
  protected readonly imagenSeleccionada = toSignal(this.formulario.controls.imagen.valueChanges, {
    initialValue: '',
  });

  /** True cuando ya se intentó enviar (para mostrar errores sin tocar). */
  protected readonly enviado = signal(false);

  /** Noticias ordenadas de la más reciente a la más antigua. */
  protected readonly noticias = computed<Noticia[]>(() =>
    ordenarNoticiasPorFecha(this.noticiasService.obtenerTodas(), 'desc'),
  );

  /** Número total de noticias visibles. */
  protected readonly total = computed(() => this.noticias().length);

  /** Categorías disponibles (única fuente de verdad del JSON). */
  protected readonly categorias = computed(() => this.noticiasService.obtenerCategorias());

  /** Mensajes de error en español por campo y tipo de error. */
  private readonly textosError: Record<CampoNoticia, Record<string, string>> = {
    titulo: {
      required: 'Escribe un título.',
      minlength: 'El título debe tener al menos 5 caracteres.',
    },
    subtitulo: {},
    categoria: {
      required: 'Selecciona una categoría.',
    },
    autor: {
      required: 'Escribe el autor.',
    },
    imagen: {
      required: 'Selecciona una imagen.',
    },
    descripcion: {
      required: 'Escribe una descripción breve.',
      minlength: 'La descripción debe tener al menos 10 caracteres.',
      maxlength: 'La descripción no puede superar los 160 caracteres.',
    },
    contenido: {
      required: 'Escribe el contenido.',
      minlength: 'El contenido debe tener al menos 50 caracteres.',
    },
  };

  /** True si el campo debe mostrar su mensaje de error. */
  protected mostrarError(campo: CampoNoticia): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.touched || this.enviado());
  }

  /** Texto de error del campo indicado, o cadena vacía si no hay error. */
  protected mensajeError(campo: CampoNoticia): string {
    const errores = this.formulario.controls[campo].errors;
    if (!errores) {
      return '';
    }

    for (const clave of Object.keys(errores)) {
      const texto = this.textosError[campo][clave];
      if (texto) {
        return texto;
      }
    }

    return 'Campo no válido.';
  }

  /** True si la noticia fue creada por el usuario (no viene del JSON). */
  protected esCreada(noticia: Noticia): boolean {
    return this.noticiasService.esCreada(noticia.id);
  }

  /** Quita la extensión .jpg para mostrar un texto más legible en el select. */
  protected nombreImagen(archivo: string): string {
    return archivo.replace(/\.jpg$/i, '');
  }

  /** Valida el formulario y, si todo está bien, crea la noticia. */
  protected enviar(): void {
    this.enviado.set(true);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.enfocarPrimerError();
      return;
    }

    const datos = this.formulario.getRawValue();
    const contenido = datos.contenido.trim();
    const noticia: Omit<Noticia, 'id'> = {
      titulo: datos.titulo.trim(),
      subtitulo: datos.subtitulo.trim(),
      categoria: datos.categoria,
      autor: datos.autor.trim(),
      cargoAutor: 'Colaborador',
      fecha: this.fechaHoy(),
      lecturaMin: this.calcularLecturaMin(contenido),
      visitas: 0,
      comentarios: 0,
      imagen: datos.imagen,
      pieFoto: datos.titulo.trim(),
      descripcion: datos.descripcion.trim(),
      contenido: this.textoAParrafos(contenido),
      cita: null,
      puntosClave: [],
      tags: [],
      destacada: false,
    };

    // No hay backend: NoticiasService persiste la noticia en localStorage.
    this.noticiasService.crearNoticia(noticia);
    this.avisosService.mostrar('Noticia creada correctamente', 'exito');

    this.formulario.reset();
    this.enviado.set(false);
  }

  /** Elimina una noticia tras pedir confirmación. */
  protected eliminar(noticia: Noticia): void {
    if (confirm(`¿Eliminar la noticia "${noticia.titulo}"?`)) {
      this.noticiasService.eliminarNoticia(noticia.id);
      this.avisosService.mostrar('Noticia eliminada', 'info');
    }
  }

  /** Restablece el listado original del JSON tras pedir confirmación. */
  protected restablecer(): void {
    if (confirm('¿Restablecer las noticias originales? Se borrarán las que creaste.')) {
      this.noticiasService.restablecer();
      this.avisosService.mostrar('Noticias restablecidas', 'info');
    }
  }

  /** Lleva el foco al primer campo inválido del formulario. */
  private enfocarPrimerError(): void {
    const primerError = this.formularioRef()?.nativeElement.querySelector<HTMLElement>(
      'input.ng-invalid, select.ng-invalid, textarea.ng-invalid',
    );
    primerError?.focus();
  }

  /** Fecha de hoy en formato "AAAA-MM-DD". */
  private fechaHoy(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  /** Tiempo de lectura estimado: 200 palabras por minuto, mínimo 1. */
  private calcularLecturaMin(texto: string): number {
    const palabras = texto.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(palabras / 200));
  }

  /** Convierte el contenido en párrafos separados por líneas en blanco. */
  private textoAParrafos(texto: string): string[] {
    const parrafos = texto
      .split(/\n\s*\n/)
      .map((parrafo) => parrafo.trim())
      .filter(Boolean);
    return parrafos.length ? parrafos : [texto];
  }
}
