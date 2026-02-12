'use server'

import { getCategories } from './getCategories';
import { getMealInfo } from './getMealInfo';
import { getPriceHistory } from './getPriceHistory';
import type { EnrichedMeal } from '@/types/app';
import transformPriceHistory from '@/utils/transformPriceHistory';

export async function getAllMeals(venueId: string, locale: string): Promise<EnrichedMeal[]> {
  const [priceHistoryData, categories, mealInfo] = await Promise.all([
    getPriceHistory(venueId),
    getCategories(venueId),
    getMealInfo(venueId),
  ]);

  const enrichedMeals: EnrichedMeal[] = priceHistoryData.map((item) => ({
    name: item.name,
    category: categories[item.name] || 'other',
    prices: transformPriceHistory(item.prices),
    images: item.images,
    info: mealInfo[item.name]?.[locale],
  }));

  return enrichedMeals;
}
