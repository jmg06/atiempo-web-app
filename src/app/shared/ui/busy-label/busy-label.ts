import { Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'at-busy-label',
  imports: [MatProgressSpinner],
  template: `
    @if (busy()) {
      <mat-spinner role="presentation" aria-hidden="true" [diameter]="24" [strokeWidth]="3" />
      <span>UN MOMENTO</span>
    } @else {
      <ng-content />
    }
  `,
  host: {
    'aria-live': 'polite',
    class: 'flex items-center justify-center gap-2',
  },
})
export class BusyLabel {
  readonly busy = input(false);
}
