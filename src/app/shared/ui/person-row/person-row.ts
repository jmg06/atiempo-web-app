import { Component, computed, input } from '@angular/core';

import { MembershipStatus } from '../../../domain/household-member';
import { StatusPill } from '../status-pill/status-pill';

@Component({
  selector: 'at-person-row',
  imports: [StatusPill],
  template: `
    <div class="flex flex-1 items-center gap-4">
      <span
        aria-hidden="true"
        class="flex size-12 shrink-0 items-center justify-center rounded-full text-title-medium"
        [class]="avatarClasses()"
      >
        {{ initial() }}
      </span>
      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
        <p class="text-body-large text-on-surface">{{ name() }}</p>
        <p class="text-body-medium text-on-surface-variant">{{ description() }}</p>
      </div>
    </div>
    @if (status() === 'invited' && pillLabel()) {
      <at-status-pill tone="unaccepted">{{ pillLabel() }}</at-status-pill>
    }
  `,
  host: {
    class:
      'flex flex-col items-start gap-4 border-b border-outline-variant bg-surface px-4 py-3.5 md:flex-row md:items-center',
  },
})
export class PersonRow {
  readonly name = input.required<string>();
  readonly description = input.required<string>();
  readonly status = input<MembershipStatus>('accepted');
  readonly pillLabel = input<string>();

  protected readonly initial = computed(() => this.name().trim().charAt(0).toUpperCase());
  protected readonly avatarClasses = computed(() =>
    this.status() === 'accepted'
      ? 'bg-primary-container text-on-primary-container'
      : 'bg-surface-container-highest text-on-surface-variant'
  );
}
