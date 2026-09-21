import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, schema, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { AccountStore } from '../../data/account-store';
import { AccessPage } from '../../shared/layout/access-page/access-page';
import { FormCard } from '../../shared/layout/form-card/form-card';
import { BusyLabel } from '../../shared/ui/busy-label/busy-label';
import { NoticeBanner } from '../../shared/ui/notice-banner/notice-banner';
import { TextField } from '../../shared/ui/text-field/text-field';
import { validateEmail } from './access-form';

interface RecoverFormValue {
  readonly email: string;
}

const EMPTY_RECOVER: RecoverFormValue = { email: '' };

const recoverSchema = schema<RecoverFormValue>((recovery) => {
  validate(recovery.email, ({ value }) => validateEmail(value()));
});

@Component({
  selector: 'at-recover-password-page',
  imports: [FormField, FormRoot, MatButton, RouterLink, AccessPage, FormCard, BusyLabel, NoticeBanner, TextField],
  template: `
    <at-access-page>
      <form [formRoot]="recoverForm">
        <at-form-card heading="Recupera tu clave">
          <p class="text-body-large text-on-surface-variant">
            Escribe el correo con el que entras. Te mandamos un enlace para poner una clave nueva.
          </p>
          <at-text-field label="Correo" type="email" autocomplete="email" [formField]="recoverForm.email" />
          <button matButton="filled" type="submit" class="w-full" [disabled]="working()">
            <at-busy-label [busy]="working()">MANDARME EL ENLACE</at-busy-label>
          </button>
          <div class="flex">
            <a matButton="text" [routerLink]="signInPath">Volver a entrar</a>
          </div>
          @if (sentTo(); as address) {
            <at-notice-banner kind="result">
              El enlace salió a {{ address }}. Vale por 2 horas y si no llega, revisa el correo no deseado.
            </at-notice-banner>
          } @else {
            <at-notice-banner>El enlace vale por 2 horas. Si no llega, revisa el correo no deseado.</at-notice-banner>
          }
        </at-form-card>
      </form>
    </at-access-page>
  `,
})
export default class RecoverPasswordPage {
  private readonly accounts = inject(AccountStore);

  protected readonly signInPath = `/${APP_PATHS.signIn}`;
  protected readonly sentTo = signal<string | null>(null);

  protected readonly model = signal<RecoverFormValue>(EMPTY_RECOVER);
  protected readonly recoverForm = form(this.model, recoverSchema, {
    submission: {
      action: () => this.sendLink(),
      onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
    },
  });

  protected readonly working = computed(() => this.recoverForm().submitting());

  private async sendLink(): Promise<undefined> {
    await this.accounts.sendRecoveryLink();
    this.sentTo.set(this.model().email.trim());

    return undefined;
  }
}
