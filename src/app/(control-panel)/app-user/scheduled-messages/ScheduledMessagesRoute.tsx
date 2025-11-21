import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';
import ScheduledMessage from './scheduled-message/ScheduledMessage';

const ScheduledMessages = lazy(() => import('./ScheduledMessages'));

const ScheduledMessagesRoute: FuseRouteItemType = {
  path: '',
  children: [
    {
      path: 'scheduled-messages',
      children: [
        {
          path: '',
          element: <ScheduledMessages />,
        },
        {
          path: ':uid',
          element: <ScheduledMessage />,
        },
      ],
    },
  ],
  auth: authRoles.collaborator,
};

export default ScheduledMessagesRoute;
