import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { APP_PATHS } from '../../app.paths';
import { HouseholdStore } from '../../data/household-store';
import { describeMemberAccess } from '../../domain/household-member';
import { SitePage } from '../../shared/layout/site-page/site-page';
import { BusyLabel } from '../../shared/ui/busy-label/busy-label';
import { NoticeBanner } from '../../shared/ui/notice-banner/notice-banner';
import { PersonRow } from '../../shared/ui/person-row/person-row';
import { SectionCard } from '../../shared/ui/section-card/section-card';

@Component({
  selector: 'at-people-page',
  imports: [MatButton, RouterLink, SitePage, BusyLabel, NoticeBanner, PersonRow, SectionCard],
  template: `
    <at-site-page section="people" heading="Personas del hogar" [details]="headerDetails()">
      @if (invitationNotice(); as notice) {
        <at-notice-banner kind="result">{{ notice }}</at-notice-banner>
      }

      <at-section-card heading="Quién puede administrar las dosis">
        <a card-actions matButton="outlined" class="w-full sm:w-75" [routerLink]="invitePath">INVITAR A ALGUIEN</a>
        <div>
          @for (person of people(); track person.id) {
            <at-person-row
              pillLabel="INVITADA, SIN ACEPTAR"
              [name]="person.fullName"
              [description]="person.access"
              [status]="person.status"
            />
          }
        </div>
        @if (invitedMember()) {
          <div class="flex justify-end">
            <button
              matButton="outlined"
              type="button"
              class="w-full sm:w-85"
              [disabled]="resending()"
              (click)="resendInvitation()"
            >
              <at-busy-label [busy]="resending()">REENVIAR LA INVITACIÓN</at-busy-label>
            </button>
          </div>
        }
      </at-section-card>

      <at-notice-banner>
        Delegar una dosis no funciona hasta que la otra persona acepta la invitación.
      </at-notice-banner>
      <p class="text-body-medium text-on-surface-variant">
        En esta versión el hogar admite un solo segundo cuidador. Para cambiarlo hay que quitar al actual y volver a
        invitar.
      </p>
    </at-site-page>
  `,
})
export default class PeoplePage {
  private readonly store = inject(HouseholdStore);

  protected readonly invitePath = `/${APP_PATHS.invitePerson}`;
  protected readonly invitationNotice = this.store.invitationNotice;
  protected readonly invitedMember = this.store.invitedMember;
  protected readonly resending = signal(false);

  private readonly household = this.store.household;

  protected readonly people = computed(() =>
    this.household().members.map((member) => ({ ...member, access: describeMemberAccess(member) }))
  );
  protected readonly headerDetails = computed(() => {
    const count = this.household().members.length;

    return [this.household().name, `${count} ${count === 1 ? 'persona' : 'personas'}`];
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.store.dismissInvitationNotice());
  }

  protected async resendInvitation(): Promise<void> {
    this.resending.set(true);
    await this.store.resendInvitation();
    this.resending.set(false);
  }
}
