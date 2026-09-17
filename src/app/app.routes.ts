import { Routes } from '@angular/router';

import { APP_PATHS } from './app.paths';
import { knownBlockGuard } from './features/schedule/known-block.guard';
import { siteZone } from './view-transitions';

export const routes: Routes = [
  {
    path: APP_PATHS.desk,
    pathMatch: 'full',
    title: 'Escritorio · a tiempo',
    data: siteZone,
    loadComponent: () => import('./features/desk/desk-page'),
  },
  {
    path: APP_PATHS.schedule,
    title: 'Esquema · a tiempo',
    data: siteZone,
    loadComponent: () => import('./features/schedule/schedule-page'),
  },
  {
    path: APP_PATHS.blockEditor,
    title: 'Editar el bloque · a tiempo',
    data: siteZone,
    canActivate: [knownBlockGuard],
    loadComponent: () => import('./features/schedule/block-editor-page'),
  },
  {
    path: APP_PATHS.dayReview,
    title: 'Revisar el día · a tiempo',
    data: siteZone,
    loadComponent: () => import('./features/schedule/day-review-page'),
  },
];
