import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, schema, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { HouseholdStore } from '../../data/household-store';
import { MOCK_HOUSEHOLD } from '../../data/mock-household';
import { AccessPage } from '../../shared/layout/access-page/access-page';
import { FormCard } from '../../shared/layout/form-card/form-card';
import { BusyLabel } from '../../shared/ui/busy-label/busy-label';
import { TextField } from '../../shared/ui/text-field/text-field';
import { validateBirthDate, validateRequired } from './access-form';

interface HouseholdFormValue {
  readonly name: string;
  readonly careRecipientName: string;
  readonly birthDate: string;
}

const DEFAULT_HOUSEHOLD: HouseholdFormValue = {
  name: MOCK_HOUSEHOLD.name,
  careRecipientName: MOCK_HOUSEHOLD.careRecipientName,
  birthDate: '14 / 03 / 2011',
};

const householdSchema = schema<HouseholdFormValue>((household) => {
  validate(household.name, ({ value }) => validateRequired(value(), 'Escribe cómo se llama el hogar.'));
  validate(household.careRecipientName, ({ value }) =>
    validateRequired(value(), 'Escribe el nombre de quien recibe las dosis.')
  );
  validate(household.birthDate, ({ value }) => validateBirthDate(value()));
});

@Component({
  selector: 'at-create-household-page',
  imports: [FormField, FormRoot, MatButton, AccessPage, FormCard, BusyLabel, TextField],
  template: `
    <at-access-page [step]="3">
      <form [formRoot]="householdForm">
        <at-form-card heading="Crea tu hogar">
          <p class="text-body-large text-on-surface-variant">Es el espacio donde vive el tratamiento del hogar.</p>

          <div role="group" aria-labelledby="household-group" class="flex flex-col gap-4">
            <p id="household-group" class="text-label-medium text-on-surface-variant">EL HOGAR</p>
            <at-text-field
              label="Cómo se llama"
              supportingText="Es solo un nombre para reconocerlo. Puedes cambiarlo después."
              [formField]="householdForm.name"
            />
          </div>

          <div role="group" aria-labelledby="care-recipient-group" class="flex flex-col gap-4">
            <p id="care-recipient-group" class="text-label-medium text-on-surface-variant">QUIÉN RECIBE LAS DOSIS</p>
            <at-text-field label="Nombre o cómo le dicen" [formField]="householdForm.careRecipientName" />
            <at-text-field
              label="Fecha de nacimiento"
              inputMode="numeric"
              supportingText="En esta versión cada hogar tiene una sola persona que recibe dosis."
              [formField]="householdForm.birthDate"
            />
          </div>

          <button matButton="filled" type="submit" class="w-full" [disabled]="working()">
            <at-busy-label [busy]="working()">CREAR EL HOGAR Y ENTRAR</at-busy-label>
          </button>

          <p class="text-body-medium text-on-surface-variant">
            Este es el único botón que crea el hogar. La pantalla anterior solo recoge el permiso.
          </p>
        </at-form-card>
      </form>
    </at-access-page>
  `,
})
export default class CreateHouseholdPage {
  private readonly router = inject(Router);
  private readonly households = inject(HouseholdStore);

  protected readonly model = signal<HouseholdFormValue>(DEFAULT_HOUSEHOLD);
  protected readonly householdForm = form(this.model, householdSchema, {
    submission: {
      action: () => this.createHousehold(),
      onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
    },
  });

  protected readonly working = computed(() => this.householdForm().submitting());

  private async createHousehold(): Promise<undefined> {
    const { name, careRecipientName } = this.model();

    await this.households.createHousehold(name.trim(), careRecipientName.trim());
    await this.router.navigateByUrl(`/${APP_PATHS.desk}`);

    return undefined;
  }
}
