import { Component, input } from '@angular/core';

@Component({
  selector: 'at-form-card',
  template: `
    <h1 class="text-headline-large text-on-surface">{{ heading() }}</h1>
    <ng-content />
  `,
  host: {
    class: 'flex w-full flex-col gap-6 rounded-large bg-surface-container-lowest p-6 shadow-level2 sm:p-10',
  },
})
export class FormCard {
  readonly heading = input.required<string>();
}
