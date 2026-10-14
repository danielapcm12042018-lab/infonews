import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación. Cada página se carga de forma perezosa (lazy) con
 * loadComponent, de modo que el paquete inicial solo incluye la portada.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'InfoNews · Inicio',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'noticias',
    title: 'InfoNews · Noticias',
    loadComponent: () =>
      import('./pages/noticias-lista/noticias-lista.component').then(
        (m) => m.NoticiasListaComponent,
      ),
  },
  {
    path: 'noticias/:id',
    // Sin title fijo: el detalle pone el título de la noticia con el Title service.
    loadComponent: () =>
      import('./pages/noticia-detalle/noticia-detalle.component').then(
        (m) => m.NoticiaDetalleComponent,
      ),
  },
  {
    path: 'favoritos',
    title: 'InfoNews · Favoritos',
    loadComponent: () =>
      import('./pages/favoritos/favoritos.component').then((m) => m.FavoritosComponent),
  },
  {
    path: 'gestionar',
    title: 'InfoNews · Gestionar',
    loadComponent: () =>
      import('./pages/gestionar/gestionar.component').then((m) => m.GestionarComponent),
  },
  {
    path: 'contacto',
    title: 'InfoNews · Contacto',
    loadComponent: () =>
      import('./pages/contacto/contacto.component').then((m) => m.ContactoComponent),
  },
  {
    path: '**',
    title: 'InfoNews · Página no encontrada',
    loadComponent: () =>
      import('./pages/no-encontrado/no-encontrado.component').then((m) => m.NoEncontradoComponent),
  },
];
