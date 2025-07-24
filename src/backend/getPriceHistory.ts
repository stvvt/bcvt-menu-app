'use server'

import clientConfig from '@/config/client';
import config from '@/config/server';
import type { Merged, MergedMealItem } from '@/types/db';
import currencyConverter from '@/utils/currencyConverter';
import fetchJson from '@/utils/fetchJson';

function compactPrices(priceHistory: MergedMealItem['prices']) {
  const compactedPrices: MergedMealItem['prices'] = [];
  let prevAmount: number | null = null;

  // Ensure that prices are sorted by date
  priceHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const price of priceHistory) {
    const amount = currencyConverter(price, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE).amount;
    if (prevAmount === null || prevAmount !== amount) {
      compactedPrices.push(price);
      prevAmount = amount;
    }
  }

  return compactedPrices;
}

export async function getPriceHistory() {
  try {
    // URL for price history data
    const url = `${config.DATA_BASE_URL}/merged.json`;
    
    const priceHistoryData  = await fetchJson<Merged>(url, {
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    return priceHistoryData.map((item) => ({
      ...item,
      prices: compactPrices(item.prices),
    }));
    
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw new Error('Failed to fetch price history data');
  }
} 