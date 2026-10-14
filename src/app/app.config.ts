import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// Registramos los datos del idioma español (fechas, números...) para los pipes.
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Toda la aplicación usa el idioma español (DatePipe, formato de números...).
    { provide: LOCALE_ID, useValue: 'es' },
    provideRouter(
      routes,
      // Al cambiar de ruta volvemos arriba; los anclajes (#) siguen funcionando.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      // Permite leer parámetros de ruta y de consulta como inputs del componente.
      withComponentInputBinding(),
    ),
    provideHttpClient(),
  ],
};
