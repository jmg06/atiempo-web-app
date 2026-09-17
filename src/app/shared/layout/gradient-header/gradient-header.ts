import { Component, computed, input } from '@angular/core';

const DETAILS_SEPARATOR = '  ·  ';

@Component({
  selector: 'at-gradient-header',
  template: `
    <div class="mx-auto flex w-full max-w-360 flex-col gap-2.5 px-4 py-8 md:px-8 xl:px-24">
      <h1 class="text-headline-large">{{ heading() }}</h1>
      @if (detailsText()) {
        <p class="text-body-large whitespace-pre-wrap">{{ detailsText() }}</p>
      }
    </div>
  `,
  host: {
    class: 'block bg-brand-gradient text-on-primary',
  },
})
export class GradientHeader {
  readonly heading = input.required<string>();
  readonly details = input<readonly string[]>([]);

  protected readonly detailsText = computed(() => this.details().join(DETAILS_SEPARATOR));
}
