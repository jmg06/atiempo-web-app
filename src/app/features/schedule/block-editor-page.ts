import {
  Component,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
  viewChildren,
} from '@angular/core';
import { FormField, FormRoot, form } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { HouseholdStore } from '../../data/household-store';
import { ScheduleStore } from '../../data/schedule-store';
import { nextMedicationToAdd } from '../../domain/schedule-block';
import { formatTimeOfDay } from '../../domain/time-of-day';
import { SitePage } from '../../shared/layout/site-page/site-page';
import { BusyLabel } from '../../shared/ui/busy-label/busy-label';
import { InfoTile } from '../../shared/ui/info-tile/info-tile';
import { MedicationCard } from '../../shared/ui/medication-card/medication-card';
import { NoticeBanner } from '../../shared/ui/notice-banner/notice-banner';
import { SectionCard } from '../../shared/ui/section-card/section-card';
import { TextField } from '../../shared/ui/text-field/text-field';
import { BlockFormValue, blockFormSchema, toBlockFormValue, toScheduleBlock } from './block-form';

@Component({
  selector: 'at-block-editor-page',
  imports: [
    FormField,
    FormRoot,
    MatButton,
    SitePage,
    BusyLabel,
    InfoTile,
    MedicationCard,
    NoticeBanner,
    SectionCard,
    TextField,
  ],
  template: `
    <at-site-page section="schedule" [sectionIsCurrentPage]="false" [heading]="heading()" [details]="headerDetails()">
      <form class="flex flex-col gap-4" [formRoot]="blockForm">
        <div class="grid items-start gap-6 lg:grid-cols-2">
          <div class="lg:p-5">
            <at-section-card heading="Cuándo suena">
              <at-text-field
                class="w-full sm:w-65"
                label="Hora del bloque"
                supportingText="La alarma suena a esta hora en los dos teléfonos."
                [formField]="blockForm.time"
              />
              <at-info-tile icon="schedule" heading="30 minutos antes o después" headingStyle="body">
                Igual para todos los bloques y fijo en esta versión.
              </at-info-tile>
              <at-notice-banner>Cuando publiques, los dos teléfonos reprograman esta alarma solos.</at-notice-banner>
            </at-section-card>
          </div>

          <at-section-card heading="Medicamentos de este bloque" density="compact">
            @if (showMissingMedications()) {
              <at-notice-banner kind="attention">Agrega al menos un medicamento a este bloque.</at-notice-banner>
            }
            @if (blockForm.medications.length) {
              <div class="flex flex-col gap-3">
                @for (medication of blockForm.medications; track $index) {
                  <at-medication-card
                    [name]="medicationName(medication().value().medicationId)"
                    [quantity]="medication.quantity"
                    [presentation]="medication.presentation"
                  />
                }
              </div>
            }
            <div>
              <button matButton="text" type="button" [disabled]="!nextMedication()" (click)="addMedication()">
                Agregar otro medicamento
              </button>
            </div>
            @if (!addedMedication()) {
              <p class="text-body-medium text-on-surface-variant">
                La cantidad se escribe y la presentación se elige entre tableta, ml, gota y sobre.
              </p>
            }
          </at-section-card>
        </div>

        <div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
          <button matButton="outlined" type="button" class="w-full sm:w-60" (click)="cancel()">CANCELAR</button>
          <button matButton="filled" type="submit" class="w-full sm:w-90" [disabled]="saving()">
            <at-busy-label [busy]="saving()">GUARDAR Y REVISAR EL DÍA</at-busy-label>
          </button>
        </div>
      </form>
    </at-site-page>
  `,
})
export default class BlockEditorPage {
  readonly bloque = input<string>();

  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  private readonly store = inject(ScheduleStore);
  private readonly household = inject(HouseholdStore).household;

  private readonly blockId = computed(() => this.bloque() ?? null);
  private readonly publishedBlock = computed(() => {
    const blockId = this.blockId();

    return blockId === null ? null : (this.store.findPublishedBlock(blockId) ?? null);
  });

  protected readonly model = linkedSignal<BlockFormValue>(() =>
    toBlockFormValue(this.store.draftFor(this.blockId())?.block ?? this.publishedBlock())
  );
  protected readonly blockForm = form(this.model, blockFormSchema, {
    submission: {
      action: () => this.save(),
      onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
    },
  });

  protected readonly addedMedication = signal(false);
  protected readonly saving = computed(() => this.blockForm().submitting());
  protected readonly nextMedication = computed(() =>
    nextMedicationToAdd(
      this.store.treatment,
      this.model().medications.map(({ medicationId }) => medicationId)
    )
  );
  protected readonly showMissingMedications = computed(() => {
    const medications = this.blockForm.medications();

    return medications.touched() && medications.errors().length > 0;
  });

  protected readonly heading = computed(() => {
    const block = this.publishedBlock();

    return block ? `Bloque de las ${formatTimeOfDay(block.time)}` : 'Bloque nuevo';
  });
  protected readonly headerDetails = computed(() => {
    const hasChanges = JSON.stringify(this.model()) !== JSON.stringify(toBlockFormValue(this.publishedBlock()));

    return ['Esquema del tratamiento', hasChanges ? 'cambios sin publicar' : this.household().name];
  });

  private readonly medicationCards = viewChildren(MedicationCard);

  protected medicationName(medicationId: string): string {
    return this.store.treatment.find(({ id }) => id === medicationId)?.name ?? '';
  }

  protected addMedication(): void {
    const medication = this.nextMedication();

    if (!medication) {
      return;
    }

    this.model.update((value) => ({
      ...value,
      medications: [
        ...value.medications,
        { medicationId: medication.id, quantity: '1', presentation: medication.usualPresentation },
      ],
    }));
    this.addedMedication.set(true);
    afterNextRender(() => this.medicationCards().at(-1)?.focusQuantity(), { injector: this.injector });
  }

  protected cancel(): void {
    this.store.discardDraft();
    this.router.navigateByUrl(`/${APP_PATHS.schedule}`);
  }

  private async save(): Promise<undefined> {
    const block = toScheduleBlock(this.model());

    if (block) {
      await this.store.saveDraft(block, this.blockId());
      await this.router.navigateByUrl(`/${APP_PATHS.dayReview}`);
    }

    return undefined;
  }
}
