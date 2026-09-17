import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'at-check-item',
  imports: [MatIcon],
  template: `
    @if (passed()) {
      <mat-icon class="text-state-done">check_circle</mat-icon>
      <span class="sr-only">Cumple:</span>
    } @else {
      <mat-icon class="text-state-pending">close</mat-icon>
      <span class="sr-only">No cumple:</span>
    }
    <span class="min-w-0 flex-1 text-body-large text-on-surface"><ng-content /></span>
  `,
  host: {
    role: 'listitem',
    class: 'flex items-center gap-3',
  },
})
export class CheckItem {
  readonly passed = input.required<boolean>();
}
