import { Component, computed, input, model } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { PRESENTATION_OPTIONS, Presentation, isLiquid } from '../../../domain/medication';
import { SelectField } from '../select-field/select-field';
import { TextField } from '../text-field/text-field';

@Component({
  selector: 'at-medication-card',
  imports: [MatIcon, SelectField, TextField],
  template: `
    <div class="flex items-center gap-3.5">
      <span class="flex size-11 shrink-0 items-center justify-center rounded-medium bg-surface-container">
        <mat-icon class="text-on-surface">{{ icon() }}</mat-icon>
      </span>
      <h3 class="min-w-0 flex-1 text-title-large text-on-surface">{{ name() }}</h3>
    </div>
    <div class="flex flex-wrap gap-4">
      <at-text-field class="w-full sm:w-[220px]" label="Cantidad" inputMode="decimal" [(value)]="quantity" />
      <at-select-field
        class="w-full sm:w-[260px]"
        label="Presentación"
        [options]="presentationOptions"
        [(value)]="presentation"
      />
    </div>
  `,
  host: {
    class: 'flex flex-col gap-4 rounded-medium bg-surface px-5 py-4 inset-ring inset-ring-outline-variant',
  },
})
export class MedicationCard {
  readonly name = input.required<string>();
  readonly quantity = model('');
  readonly presentation = model<Presentation>();

  protected readonly presentationOptions = PRESENTATION_OPTIONS;
  protected readonly icon = computed(() => {
    const presentation = this.presentation();

    return presentation && isLiquid(presentation) ? 'medication_liquid' : 'medication';
  });
}
