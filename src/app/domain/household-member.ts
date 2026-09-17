import { joinAsSpanishList } from './spanish-count';

export type MembershipStatus = 'accepted' | 'invited';

export interface HouseholdMember {
  readonly id: string;
  readonly fullName: string;
  readonly status: MembershipStatus;
  readonly isCurrentUser: boolean;
}

export function describeMembers(members: readonly HouseholdMember[]): string {
  const names = members.map(({ fullName, isCurrentUser }) => (isCurrentUser ? `${fullName}, que eres tú,` : fullName));

  return joinAsSpanishList(names).replace(/,,/g, ',').replace(/,$/, '');
}
