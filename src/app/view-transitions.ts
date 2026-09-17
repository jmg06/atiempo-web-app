import { ActivatedRouteSnapshot, ViewTransitionInfo } from '@angular/router';

export type AppZone = 'access' | 'site';

export const siteZone = { zone: 'site' satisfies AppZone };
export const accessZone = { zone: 'access' satisfies AppZone };

export function markZoneChange({ transition, from, to }: ViewTransitionInfo): void {
  if (zoneOf(from) !== zoneOf(to)) {
    transition.types.add('zone-change');
  }
}

function zoneOf(snapshot: ActivatedRouteSnapshot): AppZone | undefined {
  let route = snapshot;

  while (route.firstChild) {
    route = route.firstChild;
  }

  return route.data['zone'];
}
