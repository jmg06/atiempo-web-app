import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export type InfoTileHeadingStyle = 'title' | 'body';

@Component({
  selector: 'at-info-tile',
  imports: [MatIcon],
  template: `
    <mat-icon class="text-on-surface">{{ icon() }}</mat-icon>
    <div class="flex min-w-0 flex-1 flex-col gap-2">
      <p
        class="text-on-surface"
        [class.text-title-medium]="headingStyle() === 'title'"
        [class.text-body-large]="headingStyle() === 'body'"
      >
        {{ heading() }}
      </p>
      <p class="text-body-medium text-on-surface-variant"><ng-content /></p>
    </div>
  `,
  host: {
    class: 'flex items-start gap-4 rounded-medium bg-surface-container p-4',
  },
})
export class InfoTile {
  readonly icon = input.required<string>();
  readonly heading = input.required<string>();
  readonly headingStyle = input<InfoTileHeadingStyle>('title');
}
