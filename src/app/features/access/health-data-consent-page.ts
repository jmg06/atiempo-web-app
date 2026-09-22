import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { AccessPage } from '../../shared/layout/access-page/access-page';
import { FormCard } from '../../shared/layout/form-card/form-card';
import { InfoTile } from '../../shared/ui/info-tile/info-tile';

const DATA_PROMISES = [
  {
    icon: 'lock',
    heading: 'Qué guardamos',
    text: 'Los medicamentos del tratamiento, sus horas, y a qué hora se dio cada dosis.',
  },
  {
    icon: 'person',
    heading: 'Con quién se comparte',
    text: 'Solo con las personas que agregues al hogar. Con nadie más, ni con la EPS.',
  },
  {
    icon: 'schedule',
    heading: 'Hasta cuándo',
    text: 'Hasta que nos pidas borrarlo, escribiendo a hola@atiempo.app.',
  },
] as const;

@Component({
  selector: 'at-health-data-consent-page',
  imports: [MatButton, MatCheckbox, RouterLink, AccessPage, FormCard, InfoTile],
  template: `
    <at-access-page [step]="2">
      <at-form-card heading="Tus datos de salud">
        <p class="text-body-large text-on-surface-variant">
          Antes de crear el hogar necesitamos tu permiso. Esto es lo que pasa con la información.
        </p>

        <div class="flex flex-col gap-3">
          @for (promise of promises; track promise.icon) {
            <at-info-tile [icon]="promise.icon" [heading]="promise.heading">{{ promise.text }}</at-info-tile>
          }
        </div>

        <mat-checkbox [checked]="accepted()" (change)="accepted.set($event.checked)">
          Autorizo el tratamiento de mis datos de salud y los de la persona a mi cargo.
        </mat-checkbox>

        <button matButton="filled" type="button" class="w-full" [disabled]="!accepted()" (click)="acceptAndContinue()">
          ACEPTO Y CONTINUO
        </button>
        <div class="flex">
          <a matButton="text" [routerLink]="signUpPath">No acepto</a>
        </div>

        <p class="text-body-medium text-on-surface-variant">
          Sin este permiso no se puede crear el hogar, porque no habría permiso para guardar el dato de salud.
        </p>
      </at-form-card>
    </at-access-page>
  `,
})
export default class HealthDataConsentPage {
  private readonly router = inject(Router);

  protected readonly promises = DATA_PROMISES;
  protected readonly signUpPath = `/${APP_PATHS.signUp}`;
  protected readonly accepted = signal(true);

  protected acceptAndContinue(): void {
    this.router.navigateByUrl(`/${APP_PATHS.createHousehold}`);
  }
}
