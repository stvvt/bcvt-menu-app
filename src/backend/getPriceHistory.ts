'use server'

import { getVenueOrThrow } from '@/config/venues';
import type { Merged } from '@/types/db';
import fetchJson from '@/utils/fetchJson';

export async function getPriceHistory(venueId: string) {
  const venue = getVenueOrThrow(venueId);
  
  // URL for price history data
  const url = `${venue.dataUrl}/merged.json`;
  
  const priceHistoryData = await fetchJson<Merged>(url, {
    // Add cache control if needed
    next: { revalidate: 3600 } // Revalidate every hour
  });

  return priceHistoryData;
} 