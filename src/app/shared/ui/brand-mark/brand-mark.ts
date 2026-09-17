import { Component, input } from '@angular/core';

@Component({
  selector: 'at-brand-mark',
  template: `
    <span
      class="absolute top-1/2 left-1/2 aspect-square w-[43.18%] -translate-1/2 rotate-45 rounded-[31.58%] bg-brand-teal-dark"
    ></span>
  `,
  host: {
    class: 'relative block shrink-0 overflow-hidden rounded-[31.82%] bg-on-primary',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
  },
})
export class BrandMark {
  readonly size = input<number>(44);
}
