'use server'

import config from '@/config/server';
import fetchJson from '@/utils/fetchJson';
import { MealInfoData } from '@/types/db';

export async function getMealInfo() {
  try {
    // URL for meal info data
    const url = `${config.DATA_BASE_URL}/categories_rich.json`;
    
    const mealInfoData = await fetchJson<MealInfoData>(url, {
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    return mealInfoData;
    
  } catch (error) {
    console.error('Error fetching meal info:', error);
    return {};
  }
}
