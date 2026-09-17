import { Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { HouseholdStore } from '../../data/household-store';
import { ScheduleStore } from '../../data/schedule-store';
import { CLINICAL_MARGIN_MINUTES } from '../../domain/day-window';
import { describeMembers } from '../../domain/household-member';
import { countWord } from '../../domain/spanish-count';
import { SitePage } from '../../shared/layout/site-page/site-page';
import { DayTimeline } from '../../shared/ui/day-timeline/day-timeline';
import { NoticeBanner } from '../../shared/ui/notice-banner/notice-banner';
import { SectionCard } from '../../shared/ui/section-card/section-card';
import { SummaryCard } from '../../shared/ui/summary-card/summary-card';

@Component({
  selector: 'at-desk-page',
  imports: [MatButton, RouterLink, SitePage, DayTimeline, NoticeBanner, SectionCard, SummaryCard],
  template: `
    <at-site-page section="desk" [heading]="household().name" [details]="headerDetails()">
      <at-notice-banner>
        El seguimiento del día se ve en el teléfono. En esta versión la web sirve para configurar el tratamiento y el
        hogar.
      </at-notice-banner>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="flex flex-col gap-4">
          <at-summary-card
            class="cursor-pointer"
            heading="Esquema del tratamiento"
            pillLabel="PUBLICADO"
            [figure]="blocksPerDay()"
            [caption]="scheduleCaption()"
            (click)="openSection(schedulePath)"
          />
          <a matButton="outlined" class="w-full" [routerLink]="schedulePath">ABRIR EL ESQUEMA</a>
        </div>
        <div class="flex flex-col gap-4">
          <at-summary-card
            class="cursor-pointer"
            heading="Personas del hogar"
            pillTone="unaccepted"
            [figure]="peopleCount()"
            [caption]="peopleCaption()"
            [pillLabel]="unacceptedLabel()"
            (click)="openSection(peoplePath)"
          />
          <a matButton="outlined" class="w-full" [routerLink]="peoplePath">ABRIR PERSONAS</a>
        </div>
      </div>

      <at-section-card [heading]="'El día de ' + household().careRecipientName">
        <p class="text-body-medium text-on-surface-variant">
          Los {{ blockCountWord() }} bloques del esquema publicado. El seguimiento de cada dosis se hace en el teléfono.
        </p>
        <at-day-timeline [blocks]="blockTimes()" />
      </at-section-card>
    </at-site-page>
  `,
})
export default class DeskPage {
  private readonly router = inject(Router);
  private readonly scheduleStore = inject(ScheduleStore);

  protected readonly schedulePath = `/${APP_PATHS.schedule}`;
  protected readonly peoplePath = `/${APP_PATHS.people}`;
  protected readonly household = inject(HouseholdStore).household;

  private readonly blocks = this.scheduleStore.publishedBlocks;

  protected readonly blocksPerDay = computed(() => `${this.blocks().length} bloques al día`);
  protected readonly blockCountWord = computed(() => countWord(this.blocks().length));
  protected readonly blockTimes = computed(() => this.blocks().map(({ time }) => time));
  protected readonly headerDetails = computed(() => [
    this.household().careRecipientName,
    this.blocksPerDay(),
    `margen de ${CLINICAL_MARGIN_MINUTES} minutos`,
  ]);
  protected readonly scheduleCaption = computed(() =>
    this.scheduleStore.publishedToday()
      ? 'Último cambio publicado hoy'
      : `Último cambio publicado el ${this.scheduleStore.lastPublishedOn}`
  );

  private readonly members = computed(() => this.household().members);

  protected readonly peopleCount = computed(() => {
    const count = this.members().length;

    return `${count} ${count === 1 ? 'persona' : 'personas'}`;
  });
  protected readonly peopleCaption = computed(() => describeMembers(this.members()));
  protected readonly unacceptedLabel = computed(() => {
    const invited = this.members().filter(({ status }) => status === 'invited').length;

    return invited > 0 ? `${invited} SIN ACEPTAR` : undefined;
  });

  protected openSection(path: string): void {
    this.router.navigateByUrl(path);
  }
}
