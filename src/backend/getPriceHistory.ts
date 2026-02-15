'use server'

import { getDatasource } from '@/datasources/factory';

export async function getPriceHistory(venueId: string) {
  const ds = getDatasource(venueId);
  return ds.getPriceHistory();
}
