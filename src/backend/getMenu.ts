'use server'

import { getCategories } from './getCategories';
import { getMealInfo } from './getMealInfo';
import { getPriceHistory } from './getPriceHistory';
import { getDatasource } from '@/datasources/factory';
import type { DailyMenu, MergedMealItem } from '@/types/db';
import type { EnrichedMeal } from '@/types/app';
import { NotFoundError } from '@/errors/NotFoundError';
import currencyConverter from '@/utils/currencyConverter';
import clientConfig from '@/config/client';
import transformPriceHistory from '@/utils/transformPriceHistory';

export type MealGroup = {
  category: string;
  meals: EnrichedMeal[];
};

export async function getMenu(venueId: string, date: Date, locale: string): Promise<MealGroup[]> {
  const ds = getDatasource(venueId);
  const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format

  let menuData: DailyMenu;
  try {
    menuData = await ds.getDailyMenu(formattedDate);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return [];
    }
    throw error;
  }

  // Fetch categories, price history data, and meal info
  const [categories, priceHistoryData, mealInfo] = await Promise.all([
    getCategories(venueId),
    getPriceHistory(venueId),
    getMealInfo(venueId)
  ]);
  
  // Create a map of price history by meal name for efficient lookup
  const priceHistoryMap = new Map<string, MergedMealItem>();
  priceHistoryData.forEach((item) => {
    priceHistoryMap.set(item.name.toLowerCase(), item);
  });
  
  // Enrich menu data with categories, price history, and meal info
  const enrichedMeals = menuData.meals?.map((meal) => {
    return {
      name: meal.name,
      category: categories[meal.name],
      prices: transformPriceHistory(priceHistoryMap.get(meal.name.toLowerCase())?.prices ?? []),
      images: priceHistoryMap.get(meal.name.toLowerCase())?.images ?? [],
      info: mealInfo[meal.name]?.[locale]
    }
  }) || [];

  // Define category order
  const categoryOrder = [
    'закуски',
    'супи', 
    'салати',
    'предястия',
    'основни ястия',
    'гарнитури',
    'десерти',
    'напитки'
  ];

  // Group meals by category
  const mealsByCategory = enrichedMeals.reduce<Record<string, EnrichedMeal[]>>((acc, meal) => {
    if (!meal.category) return acc;
    
    if (!acc[meal.category]) {
      acc[meal.category] = [];
    }
    acc[meal.category].push(meal);
    return acc;
  }, {});
  
  // Return groups in the specified order with meals sorted by price
  const groupedByCategory = categoryOrder
    .filter(category => mealsByCategory[category]?.length > 0)
    .map(category => {
      return {
        category,
        meals: mealsByCategory[category].sort((a, b) => (
          currencyConverter(a.prices[a.prices.length - 1], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE) 
            - currencyConverter(b.prices[b.prices.length - 1], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE))
        ),
      }
    });
  
  return groupedByCategory;
} 