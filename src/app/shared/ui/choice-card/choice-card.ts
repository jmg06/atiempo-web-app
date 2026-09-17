import { Component, ViewEncapsulation, input } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';

@Component({
  selector: 'at-choice-card',
  imports: [MatRadioButton],
  template: `
    <mat-radio-button [value]="value()">
      <span class="flex flex-col gap-2">
        <span class="text-title-medium text-on-surface">{{ heading() }}</span>
        <span class="text-body-medium text-on-surface-variant">{{ description() }}</span>
      </span>
    </mat-radio-button>
  `,
  styleUrl: './choice-card.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class:
      'block rounded-medium inset-ring inset-ring-outline has-[.mat-mdc-radio-checked]:bg-surface-container has-[.mat-mdc-radio-checked]:inset-ring-2 has-[.mat-mdc-radio-checked]:inset-ring-primary',
  },
})
export class ChoiceCard<T> {
  readonly value = input.required<T>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
}
