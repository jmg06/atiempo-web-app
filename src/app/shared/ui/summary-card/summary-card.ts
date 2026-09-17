import { Component, input } from '@angular/core';

import { StatusTone } from '../../../domain/status-tone';
import { StatusPill } from '../status-pill/status-pill';

@Component({
  selector: 'at-summary-card',
  imports: [StatusPill],
  template: `
    <p class="text-title-medium text-on-surface-variant">{{ heading() }}</p>
    <div class="flex items-center gap-3">
      <p class="min-w-0 flex-1 text-headline-small text-on-surface">{{ figure() }}</p>
      @if (pillLabel()) {
        <at-status-pill [tone]="pillTone()">{{ pillLabel() }}</at-status-pill>
      }
    </div>
    <p class="text-body-medium text-on-surface-variant">{{ caption() }}</p>
  `,
  host: {
    class: 'flex flex-col gap-3 rounded-medium bg-surface p-6 inset-ring inset-ring-outline-variant',
  },
})
export class SummaryCard {
  readonly heading = input.required<string>();
  readonly figure = input.required<string>();
  readonly caption = input.required<string>();
  readonly pillLabel = input<string>();
  readonly pillTone = input<StatusTone>('done');
}
