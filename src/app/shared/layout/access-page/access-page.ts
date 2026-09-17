import { Component, input } from '@angular/core';

import { AccessBrandPanel, AccessStep } from '../access-brand-panel/access-brand-panel';

@Component({
  selector: 'at-access-page',
  imports: [AccessBrandPanel],
  template: `
    <aside class="flex lg:w-[calc(41.667%+8px)] lg:shrink-0">
      <at-access-brand-panel class="flex-1" [step]="step()" />
    </aside>
    <main class="flex flex-1 items-center justify-center bg-body-gradient px-4 py-8 md:px-8 lg:py-12 lg:pr-24 lg:pl-12">
      <div class="w-full max-w-172">
        <ng-content />
      </div>
    </main>
  `,
  host: {
    class: 'flex min-h-dvh flex-col lg:flex-row',
  },
})
export class AccessPage {
  readonly step = input<AccessStep>(null);
}
