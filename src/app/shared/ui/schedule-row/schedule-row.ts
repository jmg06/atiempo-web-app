import { Component, input } from '@angular/core';
import { RouterLink, UrlTree } from '@angular/router';

@Component({
  selector: 'at-schedule-row',
  imports: [RouterLink],
  template: `
    <a
      class="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-outline-variant bg-surface px-4 py-3.5 -outline-offset-3 hover:bg-surface-container focus-visible:bg-surface-container focus-visible:outline-3 focus-visible:outline-primary"
      [routerLink]="link()"
    >
      <span class="w-full text-title-large text-on-surface sm:w-32.5">{{ time() }}</span>
      <span class="flex min-w-0 flex-1 flex-col gap-0.5">
        <span class="text-title-medium text-on-surface">{{ medications() }}</span>
        <span class="text-body-medium whitespace-pre-wrap text-on-surface-variant">{{ dose() }}</span>
      </span>
      <span class="flex h-12 items-center">
        <span
          class="inline-flex h-10 items-center rounded-full px-4 text-label-large text-on-surface-variant inset-ring inset-ring-outline-variant"
        >
          EDITAR
        </span>
      </span>
    </a>
  `,
  host: {
    class: 'block',
  },
})
export class ScheduleRow {
  readonly time = input.required<string>();
  readonly medications = input.required<string>();
  readonly dose = input.required<string>();
  readonly link = input.required<string | UrlTree>();
}
