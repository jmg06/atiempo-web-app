import { Service, signal } from '@angular/core';

import { Household } from '../domain/household';
import { MOCK_HOUSEHOLD } from './mock-household';

@Service()
export class HouseholdStore {
  private readonly state = signal<Household>(MOCK_HOUSEHOLD);

  readonly household = this.state.asReadonly();
}
