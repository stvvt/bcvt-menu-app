import { getCategories } from '@/backend/getCategories';
import { getMealInfo } from '@/backend/getMealInfo';
import { getPriceHistory } from "@/backend/getPriceHistory";
import type { EnrichedMeal } from '@/types/app';
import transformPriceHistory from '@/utils/transformPriceHistory';
import { notFound } from 'next/navigation';

async function getMeal(mealName: string, locale: string): Promise<EnrichedMeal> {
  const allMeals = await getPriceHistory();
  const meal = allMeals.find((meal) => meal.name === mealName);
  if (!meal) {
    notFound();
  }

  const [categories, mealInfo] = await Promise.all([
    getCategories(),
    getMealInfo()
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