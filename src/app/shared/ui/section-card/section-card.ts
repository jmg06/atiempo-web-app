import { Component, input } from '@angular/core';

export type SectionCardDensity = 'regular' | 'compact';

@Component({
  selector: 'at-section-card',
  template: `
    @if (heading()) {
      <div class="flex flex-wrap items-center gap-4">
        <h2 class="min-w-0 flex-1 text-title-large text-on-surface">{{ heading() }}</h2>
        <ng-content select="[card-actions]" />
      </div>
    }
    <ng-content />
  `,
  host: {
    class: 'flex flex-col rounded-large bg-surface-container-lowest shadow-level1',
    '[class.gap-6]': "density() === 'regular'",
    '[class.p-6]': "density() === 'regular'",
    '[class.gap-5]': "density() === 'compact'",
    '[class.p-5]': "density() === 'compact'",
  },
})
export class SectionCard {
  readonly heading = input<string>();
  readonly density = input<SectionCardDensity>('regular');
}
