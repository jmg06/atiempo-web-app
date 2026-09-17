import { Component, input } from '@angular/core';

import { GradientHeader } from '../gradient-header/gradient-header';
import { SiteNavBar, SiteSection } from '../site-nav-bar/site-nav-bar';

@Component({
  selector: 'at-site-page',
  imports: [GradientHeader, SiteNavBar],
  template: `
    <at-site-nav-bar [section]="section()" [sectionIsCurrentPage]="sectionIsCurrentPage()" />
    <main class="flex flex-1 flex-col">
      <at-gradient-header [heading]="heading()" [details]="details()" />
      <div class="flex-1 bg-body-gradient">
        <div class="mx-auto flex w-full max-w-360 flex-col gap-6 px-4 py-6 md:px-8 xl:px-24">
          <ng-content />
        </div>
      </div>
    </main>
  `,
  host: {
    class: 'flex min-h-dvh flex-col',
  },
})
export class SitePage {
  readonly section = input.required<SiteSection>();
  readonly sectionIsCurrentPage = input(true);
  readonly heading = input.required<string>();
  readonly details = input<readonly string[]>([]);
}
