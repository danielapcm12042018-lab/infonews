import { Component, ElementRef, effect, inject, input, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MensajeContacto } from '../../models/contacto.model';
import { AvisosService } from '../../services/avisos.service';
import { ContactoService } from '../../services/contacto.service';

/** Campos del formulario de contacto. */
type CampoContacto = 'nombre' | 'correo' | 'asunto' | 'mensaje';

/**
 * Página de contacto con formulario reactivo. Valida los campos, guarda el
 * mensaje en localStorage (no hay backend) y muestra una confirmación.
 */
@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class ContactoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly avisosService = inject(AvisosService);

  /** Información de contacto del sitio (correo, teléfono, dirección, horario). */
  protected readonly contactoService = inject(ContactoService);

  /** Asunto recibido por query param (?asunto=) desde el botón "Contactar" del detalle. */
  readonly asunto = input('');

  /** Referencia al formulario para llevar el foco al primer campo con error. */
  private readonly formularioRef = viewChild<ElementRef<HTMLFormElement>>('formularioContacto');

  /** Formulario reactivo del mensaje de contacto. */
  protected readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    asunto: ['', [Validators.required]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
  });

  /** True cuando ya se intentó enviar (para mostrar errores aunque no se toquen). */
  protected readonly enviado = signal(false);

  /** Nombre de la persona que envió el mensaje (para la confirmación visible). */
  protected readonly nombreConfirmado = signal('');

  /** Mensajes de error en español por campo y tipo de error. */
  private readonly textosError: Record<CampoContacto, Record<string, string>> = {
    nombre: {
      required: 'Escribe tu nombre.',
      minlength: 'El nombre debe tener al menos 3 caracteres.',
    },
    correo: {
      required: 'Escribe tu correo electrónico.',
      email: 'Introduce un correo electrónico válido.',
    },
    asunto: {
      required: 'Indica el asunto del mensaje.',
    },
    mensaje: {
      required: 'Escribe tu mensaje.',
      minlength: 'El mensaje debe tener al menos 10 caracteres.',
    },
  };

  constructor() {
    // Si llega un asunto por la URL (?asunto=), lo volcamos en el formulario.
    effect(() => {
      const asunto = this.asunto();
      if (asunto) {
        this.formulario.controls.asunto.setValue(asunto);
      }
    });
  }

  /** True si el campo debe mostrar su mensaje de error. */
  protected mostrarError(campo: CampoContacto): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.touched || this.enviado());
  }

  /** Texto de error del campo indicado, o cadena vacía si no hay error. */
  protected mensajeError(campo: CampoContacto): string {
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

  /** Valida y envía el formulario. */
  protected enviar(): void {
    this.enviado.set(true);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.enfocarPrimerError();
      return;
    }

    const datos = this.formulario.getRawValue();
    const mensaje: MensajeContacto = {
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim(),
      asunto: datos.asunto.trim(),
      mensaje: datos.mensaje.trim(),
      fecha: new Date().toISOString(),
    };

    // No hay backend: guardamos el mensaje en localStorage como evidencia de la interacción.
    this.contactoService.guardarMensaje(mensaje);

    this.nombreConfirmado.set(mensaje.nombre);
    this.avisosService.mostrar('Mensaje enviado correctamente', 'exito');

    this.formulario.reset();
    this.enviado.set(false);
  }

  /** Lleva el foco al primer campo inválido del formulario. */
  private enfocarPrimerError(): void {
    const primerError =
      this.formularioRef()?.nativeElement.querySelector<HTMLElement>('input.ng-invalid, textarea.ng-invalid');
    primerError?.focus();
  }
}
