export type InvitationChannel = 'phone' | 'email';

export interface Invitation {
  readonly channel: InvitationChannel;
  readonly validUntil: Date;
}

export const INVITATION_VALID_DAYS = 7;

const DAY_AND_MONTH = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long' });

export function issueInvitation(channel: InvitationChannel, sentOn: Date): Invitation {
  return { channel, validUntil: addDays(sentOn, INVITATION_VALID_DAYS) };
}

// Resending runs the deadline forward from the one it already had, it does not restart it.
export function renewInvitation(invitation: Invitation): Invitation {
  return { ...invitation, validUntil: addDays(invitation.validUntil, INVITATION_VALID_DAYS) };
}

export function describeChannel(channel: InvitationChannel): string {
  return channel === 'phone' ? 'mensaje de texto' : 'correo';
}

export function formatInvitationDate(date: Date): string {
  return DAY_AND_MONTH.format(date);
}

function addDays(date: Date, days: number): Date {
  const moved = new Date(date);

  moved.setDate(moved.getDate() + days);

  return moved;
}
