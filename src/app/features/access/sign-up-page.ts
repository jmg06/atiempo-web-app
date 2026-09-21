import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { FormField, FormRoot, form, schema, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { AccountStore } from '../../data/account-store';
import { MIN_PASSWORD_LENGTH } from '../../domain/account';
import { AccessPage } from '../../shared/layout/access-page/access-page';
import { FormCard } from '../../shared/layout/form-card/form-card';
import { BusyLabel } from '../../shared/ui/busy-label/busy-label';
import { TextField } from '../../shared/ui/text-field/text-field';
import { validateEmail, validatePassword } from './access-form';

interface SignUpFormValue {
  readonly email: string;
  readonly password: string;
}

const EMPTY_SIGN_UP: SignUpFormValue = { email: '', password: '' };

const signUpSchema = schema<SignUpFormValue>((account) => {
  validate(account.email, ({ value }) => validateEmail(value()));
  validate(account.password, ({ value }) => validatePassword(value()));
});

@Component({
  selector: 'at-sign-up-page',
  imports: [FormField, FormRoot, MatButton, RouterLink, AccessPage, FormCard, BusyLabel, TextField],
  template: `
    <at-access-page [step]="1">
      <form [formRoot]="signUpForm">
        <at-form-card heading="Crea tu cuenta">
          <at-text-field
            label="Correo"
            type="email"
            autocomplete="email"
            supportingText="Con este correo entras al sitio desde cualquier computador."
            [errorText]="emailTakenError()"
            [formField]="signUpForm.email"
          />
          <at-text-field
            label="Clave"
            type="password"
            autocomplete="new-password"
            [supportingText]="passwordHint"
            [formField]="signUpForm.password"
          />
          <button matButton="filled" type="submit" class="w-full" [disabled]="working()">
            <at-busy-label [busy]="working()">CONTINUAR</at-busy-label>
          </button>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <a matButton="text" [routerLink]="signInPath">Ya tengo cuenta</a>
            <a matButton="text" [routerLink]="recoverPasswordPath">Olvidé mi clave</a>
          </div>
        </at-form-card>
      </form>
    </at-access-page>
  `,
})
export default class SignUpPage {
  private readonly router = inject(Router);
  private readonly accounts = inject(AccountStore);

  protected readonly signInPath = `/${APP_PATHS.signIn}`;
  protected readonly recoverPasswordPath = `/${APP_PATHS.recoverPassword}`;
  protected readonly passwordHint = `Al menos ${MIN_PASSWORD_LENGTH} caracteres`;

  protected readonly model = signal<SignUpFormValue>(EMPTY_SIGN_UP);
  protected readonly signUpForm = form(this.model, signUpSchema, {
    submission: {
      action: () => this.createAccount(),
      onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
    },
  });

  protected readonly working = computed(() => this.signUpForm().submitting());

  private readonly emailTaken = linkedSignal<string, boolean>({
    source: () => this.model().email,
    computation: () => false,
  });

  protected readonly emailTakenError = computed(() =>
    this.emailTaken() ? 'Ese correo ya tiene una cuenta. Entra con tu clave o recupérala.' : undefined
  );

  private async createAccount(): Promise<undefined> {
    const { email, password } = this.model();

    if (await this.accounts.createAccount(email, password)) {
      await this.router.navigateByUrl(`/${APP_PATHS.healthDataConsent}`);
    } else {
      this.emailTaken.set(true);
    }

    return undefined;
  }
}
