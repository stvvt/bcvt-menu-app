// Server-side venue configuration (includes datasource config)
import { venues as clientVenues, type VenueClientConfig } from './venues.client';
import { getVenueDatasource } from './datasources';
import { notFound } from 'next/navigation';
import type { DatasourceConfig } from '@/datasources/types';

export interface VenueConfig extends VenueClientConfig {
  datasource: DatasourceConfig;
}

export const venues: VenueConfig[] = clientVenues.flatMap(v => {
  const datasource = getVenueDatasource(v.id);
  return datasource ? [{ ...v, datasource }] : [];
});

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

export function getAllVenueIds(): string[] {
  return venues.map(v => v.id);
}
