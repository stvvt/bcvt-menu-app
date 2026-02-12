// Server-side venue configuration (includes dataUrl from env)
import serverConfig from './server';
import { venues as clientVenues, getAllVenueIds, type VenueClientConfig } from './venues.client';
import { notFound } from 'next/navigation';

export interface VenueConfig extends VenueClientConfig {
  dataUrl: string;      // Base URL for venue data
}

// Map client venues to server venues with dataUrl
const venueDataUrls: Record<string, string> = {
  'bcvt': serverConfig.DATA_BASE_URL,
};

export const venues: VenueConfig[] = clientVenues.map(v => ({
  ...v,
  dataUrl: venueDataUrls[v.id] || serverConfig.DATA_BASE_URL,
}));

export function getVenue(venueId: string): VenueConfig | undefined {
  return venues.find(v => v.id === venueId);
}

export function getVenueOrThrow(venueId: string): VenueConfig {
  const venue = getVenue(venueId);
  if (!venue) {
    notFound();
  }
  return venue;
}

export { getAllVenueIds };
