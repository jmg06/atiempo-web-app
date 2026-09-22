import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { FormField, FormRoot, form, schema, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { AccountStore } from '../../data/account-store';
import { MOCK_ACCOUNT } from '../../data/mock-account';
import { ACCOUNT_LOCK_MINUTES, SIGN_IN_ATTEMPT_LIMIT } from '../../domain/account';
import { countWord } from '../../domain/spanish-count';
import { AccessPage } from '../../shared/layout/access-page/access-page';
import { FormCard } from '../../shared/layout/form-card/form-card';
import { BusyLabel } from '../../shared/ui/busy-label/busy-label';
import { TextField } from '../../shared/ui/text-field/text-field';
import { validateEmail, validateRequired } from './access-form';

interface SignInFormValue {
  readonly email: string;
  readonly password: string;
}

const DEFAULT_SIGN_IN: SignInFormValue = { email: MOCK_ACCOUNT.email, password: MOCK_ACCOUNT.password };

const signInSchema = schema<SignInFormValue>((credentials) => {
  validate(credentials.email, ({ value }) => validateEmail(value()));
  validate(credentials.password, ({ value }) => validateRequired(value(), 'Escribe la clave.'));
});

@Component({
  selector: 'at-sign-in-page',
  imports: [FormField, FormRoot, MatButton, RouterLink, AccessPage, FormCard, BusyLabel, TextField],
  template: `
    <at-access-page>
      <form [formRoot]="signInForm">
        <at-form-card heading="Entra a tu cuenta">
          <at-text-field label="Correo" type="email" autocomplete="email" [formField]="signInForm.email" />
          <at-text-field
            label="Clave"
            type="password"
            autocomplete="current-password"
            [errorText]="signInError()"
            [formField]="signInForm.password"
          />
          <button matButton="filled" type="submit" class="w-full" [disabled]="working() || locked()">
            <at-busy-label [busy]="working()">ENTRAR</at-busy-label>
          </button>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a matButton="text" [routerLink]="recoverPasswordPath">Olvidé mi clave</a>
            <a matButton="text" [routerLink]="signUpPath">No tengo cuenta</a>
          </div>
          <p class="text-body-medium text-on-surface-variant">{{ lockWarning }}</p>
        </at-form-card>
      </form>
    </at-access-page>
  `,
})
export default class SignInPage {
  private readonly router = inject(Router);
  private readonly accounts = inject(AccountStore);

  protected readonly signUpPath = `/${APP_PATHS.signUp}`;
  protected readonly recoverPasswordPath = `/${APP_PATHS.recoverPassword}`;
  protected readonly lockWarning = `Después de ${countWord(SIGN_IN_ATTEMPT_LIMIT)} intentos fallidos la cuenta se bloquea por ${countWord(ACCOUNT_LOCK_MINUTES)} minutos.`;
  protected readonly locked = this.accounts.locked;

  protected readonly model = signal<SignInFormValue>(DEFAULT_SIGN_IN);
  protected readonly signInForm = form(this.model, signInSchema, {
    submission: {
      action: () => this.signIn(),
      onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
    },
  });

  protected readonly working = computed(() => this.signInForm().submitting());

  private readonly failed = linkedSignal<string, boolean>({
    source: () => this.model().password,
    computation: () => false,
  });

  protected readonly signInError = computed(() => {
    if (this.locked()) {
      return `La cuenta se bloqueó por ${countWord(ACCOUNT_LOCK_MINUTES)} minutos.`;
    }

    if (!this.failed()) {
      return undefined;
    }

    const remaining = this.accounts.remainingAttempts();
    const attempts = remaining === 1 ? 'Queda 1 intento' : `Quedan ${remaining} intentos`;

    return `Clave incorrecta. ${attempts} antes de que la cuenta se bloquee por ${countWord(ACCOUNT_LOCK_MINUTES)} minutos.`;
  });

  private async signIn(): Promise<undefined> {
    const { email, password } = this.model();

    if (await this.accounts.signIn(email, password)) {
      await this.router.navigateByUrl(`/${APP_PATHS.desk}`);
    } else {
      this.failed.set(true);
    }

    return undefined;
  }
}
