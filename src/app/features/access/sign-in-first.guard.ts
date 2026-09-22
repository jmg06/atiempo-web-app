import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { APP_PATHS } from '../../app.paths';

// Opening the app lands on sign-in; once the app is running, the desk opens as usual.
export const signInFirstGuard: CanActivateFn = () => {
  const router = inject(Router);

  return router.navigated || router.createUrlTree([`/${APP_PATHS.signIn}`]);
};
