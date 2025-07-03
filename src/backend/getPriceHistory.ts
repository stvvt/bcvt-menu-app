'use server'

import type { PriceHistoryItem } from '@/types/PriceHistoryItem';

export async function getPriceHistory() {
  try {
    // URL for price history data
    const url = `https://raw.githubusercontent.com/stvvt/bcvt-menu-scraper/refs/heads/main/db/merged.json`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch price history: ${response.status} ${response.statusText}`);
    }

    const priceHistoryData: PriceHistoryItem[] = await response.json();
    return priceHistoryData;
    
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw new Error('Failed to fetch price history data');
  }
} 