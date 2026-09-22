import { Household } from '../domain/household';
import { issueInvitation } from '../domain/invitation';

export const MOCK_INVITATION_SENT_ON = new Date(2025, 7, 21);

export const MOCK_HOUSEHOLD: Household = {
  name: 'Casa Restrepo',
  careRecipientName: 'Samuel',
  members: [
    { id: 'carlos-restrepo', fullName: 'Carlos Restrepo', status: 'accepted', isCurrentUser: true },
    {
      id: 'marta-restrepo',
      fullName: 'Marta Restrepo',
      status: 'invited',
      isCurrentUser: false,
      invitation: issueInvitation('phone', MOCK_INVITATION_SENT_ON),
    },
  ],
};
