import { Component, computed, input, viewChild } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatIcon } from '@angular/material/icon';

import { PRESENTATION_OPTIONS, Presentation, isLiquid } from '../../../domain/medication';
import { SelectField } from '../select-field/select-field';
import { TextField } from '../text-field/text-field';

@Component({
  selector: 'at-medication-card',
  imports: [FormField, MatIcon, SelectField, TextField],
  template: `
    <div class="flex items-center gap-3.5">
      <span class="flex size-11 shrink-0 items-center justify-center rounded-medium bg-surface-container">
        <mat-icon class="text-on-surface!">{{ icon() }}</mat-icon>
      </span>
      <h3 class="min-w-0 flex-1 text-title-large text-on-surface">{{ name() }}</h3>
    </div>
    <div class="flex flex-wrap items-start gap-4">
      <at-text-field class="w-full sm:w-55" label="Cantidad" inputMode="decimal" [formField]="quantity()" />
      <at-select-field
        class="w-full sm:w-65"
        label="Presentación"
        [options]="presentationOptions"
        [formField]="presentation()"
      />
    </div>
  `,
  host: {
    class: 'flex flex-col gap-4 rounded-medium bg-surface px-5 py-4 inset-ring inset-ring-outline-variant',
  },
})
export class MedicationCard {
  readonly name = input.required<string>();
  readonly quantity = input.required<FieldTree<string>>();
  readonly presentation = input.required<FieldTree<Presentation>>();

  protected readonly presentationOptions = PRESENTATION_OPTIONS;
  protected readonly icon = computed(() =>
    isLiquid(this.presentation()().value()) ? 'medication_liquid' : 'medication'
  );

  private readonly quantityField = viewChild.required(TextField);

  focusQuantity(): void {
    this.quantityField().focus();
  }
}
