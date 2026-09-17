import { Component, DestroyRef, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { ScheduleStore } from '../../data/schedule-store';
import { CLINICAL_MARGIN_MINUTES } from '../../domain/day-window';
import { describeDoses, describeMedicationNames } from '../../domain/schedule-block';
import { formatTimeOfDay } from '../../domain/time-of-day';
import { SitePage } from '../../shared/layout/site-page/site-page';
import { DayTimeline } from '../../shared/ui/day-timeline/day-timeline';
import { NoticeBanner } from '../../shared/ui/notice-banner/notice-banner';
import { ScheduleRow } from '../../shared/ui/schedule-row/schedule-row';
import { SectionCard } from '../../shared/ui/section-card/section-card';
import { StatusPill } from '../../shared/ui/status-pill/status-pill';

@Component({
  selector: 'at-schedule-page',
  imports: [MatButton, RouterLink, SitePage, DayTimeline, NoticeBanner, ScheduleRow, SectionCard, StatusPill],
  template: `
    <at-site-page section="schedule" heading="Esquema del tratamiento" [details]="headerDetails()">
      @if (publicationNotice()) {
        <at-notice-banner kind="result">
          El esquema quedó publicado. Los dos teléfonos ya reprogramaron las alarmas del día.
        </at-notice-banner>
      }

      <at-section-card heading="Los bloques del día">
        <at-status-pill card-actions tone="done">PUBLICADO</at-status-pill>
        <a card-actions matButton="outlined" class="w-full sm:w-75" [routerLink]="newBlockPath"> AGREGAR UN BLOQUE </a>
        <at-day-timeline format="compact" [blocks]="blockTimes()" />
        <div>
          @for (row of rows(); track row.id) {
            <at-schedule-row [time]="row.time" [medications]="row.medications" [dose]="row.dose" [link]="row.link" />
          }
        </div>
      </at-section-card>

      @if (!publicationNotice()) {
        <at-notice-banner>
          Cambiar un bloque no reprograma ninguna alarma hasta que publiques el esquema.
        </at-notice-banner>
      }
      <p class="text-body-medium text-on-surface-variant">
        El margen de {{ marginMinutes }} minutos es igual para todos los bloques y fijo en esta versión.
      </p>
    </at-site-page>
  `,
})
export default class SchedulePage {
  private readonly router = inject(Router);
  private readonly store = inject(ScheduleStore);

  protected readonly newBlockPath = `/${APP_PATHS.blockEditor}`;
  protected readonly marginMinutes = CLINICAL_MARGIN_MINUTES;
  protected readonly publicationNotice = this.store.publicationNotice;

  protected readonly blockTimes = computed(() => this.store.publishedBlocks().map(({ time }) => time));
  protected readonly headerDetails = computed(() => [
    `${this.store.publishedBlocks().length} bloques al día`,
    this.store.publishedToday() ? 'publicado hoy' : `vigente desde el ${this.store.lastPublishedOn}`,
  ]);
  protected readonly rows = computed(() =>
    this.store.publishedBlocks().map((block) => ({
      id: block.id,
      time: formatTimeOfDay(block.time),
      medications: describeMedicationNames(block, this.store.treatment),
      dose: describeDoses(block),
      link: this.router.createUrlTree([this.newBlockPath], { queryParams: { bloque: block.id } }),
    }))
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => this.store.dismissPublicationNotice());
  }
}
