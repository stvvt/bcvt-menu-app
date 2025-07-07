'use server'

import config from '@/config';
import type { PriceHistoryItem } from '@/types/PriceHistoryItem';
import fetchJson from '@/utils/fetchJson';

export async function getPriceHistory() {
  try {
    // URL for price history data
    const url = `${config.DATA_BASE_URL}/db/merged.json`;
    
    const priceHistoryData: PriceHistoryItem[] = await fetchJson(url, {
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    return priceHistoryData;
    
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw new Error('Failed to fetch price history data');
  }
} 