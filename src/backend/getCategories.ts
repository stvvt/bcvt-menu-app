'use server'

import { getDatasource } from '@/datasources/factory';

export async function getCategories(venueId: string) {
  const ds = getDatasource(venueId);
  return ds.getCategories();
}
