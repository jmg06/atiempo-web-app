import { Invitation, describeChannel, formatInvitationDate } from './invitation';
import { joinAsSpanishList } from './spanish-count';

export type MembershipStatus = 'accepted' | 'invited';

export interface HouseholdMember {
  readonly id: string;
  readonly fullName: string;
  readonly status: MembershipStatus;
  readonly isCurrentUser: boolean;
  readonly invitation?: Invitation;
}

const PRIMARY_CAREGIVER = 'Cuidador principal, eres tú. Puede cambiar el esquema y las personas.';
const SECOND_CAREGIVER = 'Puede recibir dosis delegadas y confirmarlas.';

export function describeMembers(members: readonly HouseholdMember[]): string {
  const names = members.map(({ fullName, isCurrentUser }) => (isCurrentUser ? `${fullName}, que eres tú,` : fullName));

  return joinAsSpanishList(names).replaceAll(',,', ',').replace(/,$/, '');
}

export function describeMemberAccess(member: HouseholdMember): string {
  const invitation = member.invitation;

  if (member.status === 'invited' && invitation) {
    return `Se le mandó un ${describeChannel(invitation.channel)}. Vale hasta el ${formatInvitationDate(invitation.validUntil)} y todavía no puede recibir dosis.`;
  }

  return member.isCurrentUser ? PRIMARY_CAREGIVER : SECOND_CAREGIVER;
}
