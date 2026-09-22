import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, ValidationError, form, schema, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatRadioChange, MatRadioGroup } from '@angular/material/radio';
import { Router } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { HouseholdStore } from '../../data/household-store';
import { isEmail } from '../../domain/account';
import { INVITATION_VALID_DAYS, InvitationChannel } from '../../domain/invitation';
import { SitePage } from '../../shared/layout/site-page/site-page';
import { BusyLabel } from '../../shared/ui/busy-label/busy-label';
import { ChoiceCard } from '../../shared/ui/choice-card/choice-card';
import { SectionCard } from '../../shared/ui/section-card/section-card';
import { TextField } from '../../shared/ui/text-field/text-field';

interface InviteFormValue {
  readonly channel: InvitationChannel;
  readonly fullName: string;
  readonly phone: string;
  readonly email: string;
}

const DEFAULT_INVITE: InviteFormValue = {
  channel: 'phone',
  fullName: 'Marta Restrepo',
  phone: '300 000 00 00',
  email: 'marta.restrepo@correo.com',
};

const PHONE_DIGITS = 10;

const inviteSchema = schema<InviteFormValue>((invitation) => {
  validate(invitation.fullName, ({ value }) =>
    value().trim() ? undefined : { kind: 'required', message: 'Escribe el nombre de la persona.' }
  );
  validate(invitation.phone, ({ value, valueOf }) =>
    valueOf(invitation.channel) === 'phone' ? validatePhone(value()) : undefined
  );
  validate(invitation.email, ({ value }) => validateEmail(value()));
});

function validatePhone(text: string): ValidationError | undefined {
  const digits = text.replaceAll(/\D/g, '');

  if (!digits) {
    return { kind: 'required', message: 'Escribe el teléfono de la persona.' };
  }

  return digits.length === PHONE_DIGITS
    ? undefined
    : { kind: 'format', message: `El teléfono tiene ${PHONE_DIGITS} dígitos, así: 300 000 00 00` };
}

function validateEmail(text: string): ValidationError | undefined {
  if (!text.trim()) {
    return { kind: 'required', message: 'Escribe el correo de la persona.' };
  }

  return isEmail(text) ? undefined : { kind: 'format', message: 'Escribe el correo así: nombre@correo.com' };
}

@Component({
  selector: 'at-invite-person-page',
  imports: [FormField, FormRoot, MatButton, MatRadioGroup, SitePage, BusyLabel, ChoiceCard, SectionCard, TextField],
  template: `
    <at-site-page
      section="people"
      heading="Invitar a alguien"
      [sectionIsCurrentPage]="false"
      [details]="headerDetails()"
    >
      <form class="flex flex-col gap-6" [formRoot]="inviteForm">
        <at-section-card>
          <p class="text-body-large text-on-surface">
            Le llega un enlace. Cuando lo acepte va a poder recibir dosis delegadas y confirmarlas.
          </p>

          <p id="invite-channel" class="text-label-medium text-on-surface-variant">POR DÓNDE LE LLEGA</p>
          <mat-radio-group
            class="grid gap-6 md:grid-cols-2"
            aria-labelledby="invite-channel"
            [value]="model().channel"
            (change)="setChannel($event)"
          >
            <at-choice-card
              value="phone"
              heading="Por teléfono"
              description="Le llega un mensaje de texto con el enlace"
            />
            <at-choice-card value="email" heading="Por correo" description="Le llega un correo con el enlace" />
          </mat-radio-group>

          <div class="grid items-start gap-6 md:grid-cols-2">
            <at-text-field
              label="Nombre de la persona"
              autocomplete="name"
              supportingText="Es el nombre con el que aparece en la lista del hogar."
              [formField]="inviteForm.fullName"
            />
            <at-text-field
              label="Teléfono de la persona"
              type="tel"
              autocomplete="tel"
              supportingText="A este número le llega el mensaje de texto."
              [formField]="inviteForm.phone"
            />
            <at-text-field
              label="Correo de la persona"
              type="email"
              autocomplete="email"
              supportingText="Es el correo con el que va a entrar a la aplicación."
              [formField]="inviteForm.email"
            />
          </div>

          <div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
            <button matButton="outlined" type="button" class="w-full sm:w-60" (click)="cancel()">CANCELAR</button>
            <button matButton="filled" type="submit" class="w-full sm:w-90" [disabled]="working()">
              <at-busy-label [busy]="working()">ENVIAR LA INVITACIÓN</at-busy-label>
            </button>
          </div>
        </at-section-card>

        <p class="text-body-medium text-on-surface-variant">{{ validityNote }}</p>
      </form>
    </at-site-page>
  `,
})
export default class InvitePersonPage {
  private readonly router = inject(Router);
  private readonly households = inject(HouseholdStore);

  protected readonly validityNote = `La invitación vale por ${INVITATION_VALID_DAYS} días. Si vence, se puede reenviar desde Personas del hogar.`;

  protected readonly model = signal<InviteFormValue>(DEFAULT_INVITE);
  protected readonly inviteForm = form(this.model, inviteSchema, {
    submission: {
      action: () => this.sendInvitation(),
      onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
    },
  });

  protected readonly working = computed(() => this.inviteForm().submitting());
  protected readonly headerDetails = computed(() => ['Personas del hogar', this.households.household().name]);

  protected setChannel(change: MatRadioChange): void {
    this.model.update((value) => ({ ...value, channel: change.value as InvitationChannel }));
  }

  protected cancel(): void {
    this.router.navigateByUrl(`/${APP_PATHS.people}`);
  }

  private async sendInvitation(): Promise<undefined> {
    const { fullName, channel } = this.model();

    await this.households.sendInvitation(fullName.trim(), channel);
    await this.router.navigateByUrl(`/${APP_PATHS.people}`);

    return undefined;
  }
}
