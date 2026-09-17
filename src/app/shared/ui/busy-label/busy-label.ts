import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'at-busy-label',
  imports: [MatIcon],
  template: `
    @if (busy()) {
      <mat-icon class="align-middle">pending</mat-icon>
      <span class="ms-2 align-middle">UN MOMENTO</span>
    } @else {
      <ng-content />
    }
  `,
  host: {
    'aria-live': 'polite',
  },
})
export class BusyLabel {
  readonly busy = input(false);
}
