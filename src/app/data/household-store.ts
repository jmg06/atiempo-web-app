import { Service, computed, signal } from '@angular/core';

import { Household } from '../domain/household';
import { HouseholdMember } from '../domain/household-member';
import {
  InvitationChannel,
  describeChannel,
  formatInvitationDate,
  issueInvitation,
  renewInvitation,
} from '../domain/invitation';
import { MOCK_HOUSEHOLD, MOCK_INVITATION_SENT_ON } from './mock-household';
import { simulateLatency } from './simulated-latency';

const SECOND_CAREGIVER_ID = 'segundo-cuidador';

@Service()
export class HouseholdStore {
  private readonly state = signal<Household>(MOCK_HOUSEHOLD);
  private readonly invitationNoticeState = signal<string | null>(null);

  readonly household = this.state.asReadonly();
  readonly invitationNotice = this.invitationNoticeState.asReadonly();
  readonly invitedMember = computed(() => this.state().members.find(({ status }) => status === 'invited'));

  async createHousehold(name: string, careRecipientName: string): Promise<void> {
    await simulateLatency();
    this.state.update((household) => ({ ...household, name, careRecipientName }));
  }

  async sendInvitation(fullName: string, channel: InvitationChannel): Promise<void> {
    await simulateLatency();

    const invitation = issueInvitation(channel, MOCK_INVITATION_SENT_ON);
    const invited: HouseholdMember = {
      id: SECOND_CAREGIVER_ID,
      fullName,
      status: 'invited',
      isCurrentUser: false,
      invitation,
    };

    this.state.update((household) => ({
      ...household,
      members: [...household.members.filter(({ status }) => status === 'accepted'), invited],
    }));
    this.announceInvitation('La invitación salió', invitation.channel, invitation.validUntil);
  }

  async resendInvitation(): Promise<void> {
    await simulateLatency();

    const member = this.invitedMember();

    if (!member?.invitation) {
      return;
    }

    const invitation = renewInvitation(member.invitation);

    this.state.update((household) => ({
      ...household,
      members: household.members.map((each) => (each.id === member.id ? { ...each, invitation } : each)),
    }));
    this.announceInvitation('La invitación salió otra vez', invitation.channel, invitation.validUntil);
  }

  dismissInvitationNotice(): void {
    this.invitationNoticeState.set(null);
  }

  private announceInvitation(opening: string, channel: InvitationChannel, validUntil: Date): void {
    this.invitationNoticeState.set(
      `${opening} por ${describeChannel(channel)}. Vale hasta el ${formatInvitationDate(validUntil)}.`
    );
  }
}
