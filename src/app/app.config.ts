import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';

import { routes } from './app.routes';
import { markZoneChange } from './view-transitions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions({ onViewTransitionCreated: markZoneChange })
    ),
    provideAppInitializer(() => {
      inject(MatIconRegistry).setDefaultFontSetClass('material-icons-outlined', 'mat-ligature-font');
    }),
  ],
};
