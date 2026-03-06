'use client';

import { createContext, useContext, type FC, type PropsWithChildren } from 'react';
import type { VenueClientConfig } from '@/config/venues.client';

const ActiveVenuesContext = createContext<VenueClientConfig[]>([]);

export const ActiveVenuesProvider: FC<PropsWithChildren<{ venues: VenueClientConfig[] }>> = ({ venues, children }) => (
  <ActiveVenuesContext value={venues}>
    {children}
  </ActiveVenuesContext>
);

export function useActiveVenues(): VenueClientConfig[] {
  return useContext(ActiveVenuesContext);
}
