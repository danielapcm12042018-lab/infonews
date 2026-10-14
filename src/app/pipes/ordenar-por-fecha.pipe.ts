import { Pipe, PipeTransform } from '@angular/core';
import { Noticia } from '../models/noticia.model';

/**
 * Única implementación del ordenamiento por fecha.
 * Las fechas "AAAA-MM-DD" se pueden comparar como texto.
 *
 * @param noticias lista a ordenar (no se modifica el original).
 * @param orden "desc" (más reciente primero, por defecto) o "asc".
 */
export function ordenarNoticiasPorFecha(
  noticias: Noticia[],
  orden: 'asc' | 'desc' = 'desc',
): Noticia[] {
  const factor = orden === 'asc' ? 1 : -1;
  return [...noticias].sort((a, b) => factor * a.fecha.localeCompare(b.fecha));
}

/**
 * Pipe standalone para ordenar noticias por fecha desde una plantilla.
 * Uso: @for (noticia of noticias | ordenarPorFecha:'desc'; track noticia.id) { ... }
 */
@Pipe({ name: 'ordenarPorFecha' })
export class OrdenarPorFechaPipe implements PipeTransform {
  transform(noticias: Noticia[], orden: 'asc' | 'desc' = 'desc'): Noticia[] {
    return ordenarNoticiasPorFecha(noticias, orden);
  }
}
