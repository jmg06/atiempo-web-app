import { Component, computed, input } from '@angular/core';

import { StatusTone } from '../../../domain/status-tone';

const TONE_CLASSES: Record<StatusTone, string> = {
  done: 'bg-state-done text-on-state-done',
  pending: 'bg-state-pending-container text-on-state-pending-container',
  scheduled: 'bg-state-scheduled-container text-on-state-scheduled-container',
  missed: 'bg-state-missed text-on-state-missed',
  delegated: 'bg-state-delegated-container text-on-state-delegated-container',
  unaccepted: 'bg-surface-container text-on-surface-variant',
};

@Component({
  selector: 'at-status-pill',
  template: '<ng-content />',
  host: {
    class:
      'inline-flex h-8 shrink-0 items-center justify-center rounded-small border border-outline-variant px-4 text-label-large whitespace-nowrap',
    '[class]': 'toneClasses()',
  },
})
export class StatusPill {
  readonly tone = input.required<StatusTone>();

  protected readonly toneClasses = computed(() => TONE_CLASSES[this.tone()]);
}
