'use server'

import { getDatasource } from '@/datasources/factory';
import { MealInfoData } from '@/types/db';

export async function getMealInfo(venueId: string): Promise<MealInfoData> {
  const ds = getDatasource(venueId);
  try {
    return await ds.getMealInfo();
  } catch (error) {
    console.error('Error fetching meal info:', error);
    return {};
  }
}
