import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { ScheduleStore } from '../../data/schedule-store';

export const knownBlockGuard: CanActivateFn = (route) => {
  const store = inject(ScheduleStore);
  const router = inject(Router);
  const blockId = route.queryParamMap.get('bloque');

  if (blockId === null || store.findPublishedBlock(blockId)) {
    return true;
  }

  return router.createUrlTree([`/${APP_PATHS.schedule}`]);
};
