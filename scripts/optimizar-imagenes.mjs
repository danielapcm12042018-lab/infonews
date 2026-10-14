/**
 * Optimiza las imágenes de public/assets/img para la web.
 *
 * Mantiene los MISMOS nombres de archivo (para no romper noticias.json ni la
 * lista del formulario de Gestionar) y aplica:
 *   - ancho máximo de 1200 px (sin ampliar las que sean más pequeñas),
 *   - calidad JPEG ~80 con codificador mozjpeg,
 *   - sin metadatos.
 *
 * Uso: npm run optimizar:img
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

/** Carpeta de imágenes de la aplicación. */
const CARPETA = 'public/assets/img';

/** Ancho máximo permitido. */
const ANCHO_MAXIMO = 1200;

/** Calidad JPEG de salida (~80). */
const CALIDAD = 80;

/** Formatea bytes como KB con un decimal. */
function kb(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

const archivos = (await readdir(CARPETA)).filter((f) => /\.jpe?g$/i.test(f));

console.log(
  'Imagen'.padEnd(34),
  'Antes'.padStart(11),
  'Después'.padStart(11),
  'Medidas'.padStart(12),
);
console.log('-'.repeat(70));

for (const archivo of archivos) {
  const ruta = join(CARPETA, archivo);
  const original = await readFile(ruta);

  // Redimensiona y recomprime en memoria (nunca amplía imágenes pequeñas).
  const optimizada = await sharp(original)
    .resize({ width: ANCHO_MAXIMO, withoutEnlargement: true })
    .jpeg({ quality: CALIDAD, mozjpeg: true })
    .toBuffer();

  // Solo reemplaza si el resultado pesa menos que el original.
  if (optimizada.length < original.length) {
    await writeFile(ruta, optimizada);
  }

  const final = await sharp(await readFile(ruta)).metadata();
  console.log(
    archivo.padEnd(34),
    kb(original.length).padStart(11),
    kb((await readFile(ruta)).length).padStart(11),
    `${final.width}x${final.height}`.padStart(12),
  );
}

console.log('\nHecho.');
