import { Component, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { HouseholdStore } from '../../data/household-store';
import { ScheduleStore } from '../../data/schedule-store';
import { CLINICAL_MARGIN_MINUTES } from '../../domain/day-window';
import { toDoseBlock } from '../../domain/schedule-block';
import { PrescriptionCheck } from '../../domain/schedule-review';
import { capitalize, countWord } from '../../domain/spanish-count';
import { formatTimeOfDay } from '../../domain/time-of-day';
import { SitePage } from '../../shared/layout/site-page/site-page';
import { BusyLabel } from '../../shared/ui/busy-label/busy-label';
import { CheckItem } from '../../shared/ui/check-item/check-item';
import { DayAxis } from '../../shared/ui/day-axis/day-axis';
import { NoticeBanner } from '../../shared/ui/notice-banner/notice-banner';
import { SectionCard } from '../../shared/ui/section-card/section-card';

@Component({
  selector: 'at-day-review-page',
  imports: [MatButton, RouterLink, SitePage, BusyLabel, CheckItem, DayAxis, NoticeBanner, SectionCard],
  template: `
    <at-site-page
      section="schedule"
      heading="Revisa el día antes de publicar"
      [sectionIsCurrentPage]="false"
      [details]="headerDetails()"
    >
      @if (blockingNotice(); as notice) {
        <at-notice-banner kind="attention">{{ notice }}</at-notice-banner>
      }

      <at-section-card heading="El día completo">
        <at-day-axis [blocks]="doseBlocks()" />
      </at-section-card>

      <at-section-card heading="Lo que se comprobó">
        <div role="list" class="flex flex-col gap-3">
          <at-check-item [passed]="review().allBlocksComplete">
            Los {{ review().blockCount }} bloques tienen hora y al menos un medicamento
          </at-check-item>
          @for (check of review().prescriptionChecks; track check.medication.id) {
            <at-check-item [passed]="check.passed">{{ describePrescriptionCheck(check) }}</at-check-item>
          }
          <at-check-item [passed]="!review().conflict">{{ marginCheck() }}</at-check-item>
        </div>
      </at-section-card>

      <div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
        <a matButton="outlined" class="w-full sm:w-70" [routerLink]="editLink()">VOLVER A EDITAR</a>
        <button
          matButton="filled"
          type="button"
          class="w-full sm:w-90"
          [disabled]="!review().canPublish || publishing()"
          (click)="publish()"
        >
          <at-busy-label [busy]="publishing()">PUBLICAR EL ESQUEMA</at-busy-label>
        </button>
      </div>
    </at-site-page>
  `,
})
export default class DayReviewPage {
  private readonly router = inject(Router);
  private readonly store = inject(ScheduleStore);
  private readonly household = inject(HouseholdStore).household;

  protected readonly review = this.store.review;
  protected readonly publishing = signal(false);
  protected readonly doseBlocks = computed(() => this.store.reviewedBlocks().map(toDoseBlock));

  protected readonly headerDetails = computed(() => {
    const change = this.store.change();

    switch (change.kind) {
      case 'moved':
        return [`Moviste el bloque de las ${formatTimeOfDay(change.from)} a las ${formatTimeOfDay(change.to)}`];
      case 'added':
        return [`Agregaste un bloque a las ${formatTimeOfDay(change.at)}`];
      case 'none':
        return [`Así queda el día de ${this.household().careRecipientName} a partir de mañana`];
    }
  });

  protected readonly marginCheck = computed(() => {
    const conflict = this.review().conflict;

    return conflict
      ? `El bloque de las ${formatTimeOfDay(conflict.block.time)} cae dentro del margen del de las ${formatTimeOfDay(conflict.nearest.time)}`
      : `Ningún bloque cae dentro del margen de ${CLINICAL_MARGIN_MINUTES} minutos de otro`;
  });

  protected readonly blockingNotice = computed(() => {
    const review = this.review();
    const failedPrescription = review.prescriptionChecks.find(({ passed }) => !passed);

    if (review.conflict) {
      return `${capitalize(countWord(review.conflict.conflictingBlockCount))} bloques quedan a menos de ${CLINICAL_MARGIN_MINUTES} minutos. Así no se puede publicar.`;
    }

    if (failedPrescription) {
      return `${capitalize(this.prescriptionSubject(failedPrescription))} ya no queda cada ${failedPrescription.hoursApart} horas. Así no se puede publicar.`;
    }

    return null;
  });

  protected readonly editLink = computed(() => {
    const draft = this.store.draft();

    if (!draft) {
      return `/${APP_PATHS.schedule}`;
    }

    return this.router.createUrlTree([`/${APP_PATHS.blockEditor}`], {
      queryParams: draft.isNew ? {} : { bloque: draft.block.id },
    });
  });

  protected describePrescriptionCheck(check: PrescriptionCheck): string {
    const subject = capitalize(this.prescriptionSubject(check));
    const verb = check.passed ? 'queda' : 'ya no queda';

    return `${subject} ${verb} cada ${check.hoursApart} horas, como lo formuló el médico`;
  }

  protected async publish(): Promise<void> {
    this.publishing.set(true);
    await this.store.publish();
    await this.router.navigateByUrl(`/${APP_PATHS.schedule}`);
  }

  private prescriptionSubject(check: PrescriptionCheck): string {
    return `el ${check.medication.name.toLowerCase()}`;
  }
}
