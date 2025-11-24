import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import Event from './event/Event';

const Events = lazy(() => import('./Events'));

/**
 * The Events page route.
 */
const EventsRoute: FuseRouteItemType = {
  path: '',
  children: [
    {
      path: 'events',
      children: [
        {
          path: '',
          element: <Events />,
        },
        {
          path: ':uid',
          element: <Event />,
        },
      ],
    },
  ],
};

export default EventsRoute;
