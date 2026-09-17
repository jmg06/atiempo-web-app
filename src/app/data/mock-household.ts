import { Household } from '../domain/household';

export const MOCK_HOUSEHOLD: Household = {
  name: 'Casa Restrepo',
  careRecipientName: 'Samuel',
  members: [
    { id: 'carlos-restrepo', fullName: 'Carlos Restrepo', status: 'accepted', isCurrentUser: true },
    { id: 'marta-restrepo', fullName: 'Marta Restrepo', status: 'invited', isCurrentUser: false },
  ],
};
