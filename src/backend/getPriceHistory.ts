'use server'

import config from '@/config/server';
import type { Merged } from '@/types/db';
import fetchJson from '@/utils/fetchJson';

export async function getPriceHistory() {
  try {
    // URL for price history data
    const url = `${config.DATA_BASE_URL}/merged.json`;
    
    const priceHistoryData  = await fetchJson<Merged>(url, {
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    return priceHistoryData;
    
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw new Error('Failed to fetch price history data');
  }
} 