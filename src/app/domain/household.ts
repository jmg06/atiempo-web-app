import { HouseholdMember } from './household-member';

export interface Household {
  readonly name: string;
  readonly careRecipientName: string;
  readonly members: readonly HouseholdMember[];
}
