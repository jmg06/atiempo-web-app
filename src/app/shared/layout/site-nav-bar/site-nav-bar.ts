import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_PATHS } from '../../../app.paths';

export type SiteSection = 'desk' | 'schedule' | 'people';

interface NavItem {
  readonly section: SiteSection;
  readonly label: string;
  readonly path: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { section: 'desk', label: 'Escritorio', path: `/${APP_PATHS.desk}` },
  { section: 'schedule', label: 'Esquema', path: `/${APP_PATHS.schedule}` },
  { section: 'people', label: 'Personas', path: `/${APP_PATHS.people}` },
];

@Component({
  selector: 'at-site-nav-bar',
  imports: [NgTemplateOutlet, RouterLink],
  template: `
    <header
      class="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:min-h-[72px] sm:flex-nowrap sm:py-0 md:px-8 xl:px-24"
    >
      @if (brandIsCurrentPage()) {
        <div class="flex flex-col whitespace-nowrap">
          <ng-container [ngTemplateOutlet]="brand" />
        </div>
      } @else {
        <a
          class="flex flex-col whitespace-nowrap rounded-extra-small focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
          [routerLink]="deskPath"
        >
          <ng-container [ngTemplateOutlet]="brand" />
        </a>
      }

      <nav aria-label="Principal" class="sm:ms-auto">
        <ul class="flex items-center gap-8">
          @for (item of navItems; track item.section) {
            <li class="flex">
              @if (item.section === section() && sectionIsCurrentPage()) {
                <span aria-current="page" class="flex flex-col items-center gap-1.5 text-label-large text-on-surface">
                  {{ item.label }}
                  <span class="h-[3px] w-full rounded-[2px] bg-primary"></span>
                </span>
              } @else {
                <a
                  class="flex flex-col items-center gap-1.5 rounded-extra-small text-label-large focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  [class]="item.section === section() ? 'text-on-surface' : 'text-on-surface-variant'"
                  [routerLink]="item.path"
                >
                  {{ item.label }}
                  @if (item.section === section()) {
                    <span class="h-[3px] w-full rounded-[2px] bg-primary"></span>
                  }
                </a>
              }
            </li>
          }
        </ul>
      </nav>
    </header>

    <ng-template #brand>
      <span class="text-title-large text-brand-teal">a tiempo</span>
      <span class="text-body-small text-on-surface-variant">Seguimiento de medicamentos en casa</span>
    </ng-template>
  `,
  host: {
    class: 'block border-b border-outline-variant bg-surface',
  },
})
export class SiteNavBar {
  readonly section = input.required<SiteSection>();
  readonly sectionIsCurrentPage = input(true);

  protected readonly navItems = NAV_ITEMS;
  protected readonly deskPath = `/${APP_PATHS.desk}`;
  protected readonly brandIsCurrentPage = computed(() => this.section() === 'desk' && this.sectionIsCurrentPage());
}
