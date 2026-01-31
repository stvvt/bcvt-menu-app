import { getCategories } from '@/backend/getCategories';
import { getMealInfo } from '@/backend/getMealInfo';
import { getPriceHistory } from "@/backend/getPriceHistory";
import type { EnrichedMeal } from '@/types/app';
import transformPriceHistory from '@/utils/transformPriceHistory';
import { notFound } from 'next/navigation';

async function getMeal(venueId: string, mealName: string, locale: string): Promise<EnrichedMeal> {
  const allMeals = await getPriceHistory(venueId);
  const meal = allMeals.find((meal) => meal.name === mealName);
  if (!meal) {
    notFound();
  }

  const [categories, mealInfo] = await Promise.all([
    getCategories(venueId),
    getMealInfo(venueId)
  ]);
  
  const category = categories[mealName];
  const info = mealInfo[mealName]?.[locale] ?? { name: mealName };
  
  return {
    name: meal.name,
    prices: transformPriceHistory(meal.prices),
    category,
    images: meal.images,
    info,
  };
}

export default getMeal;