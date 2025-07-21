import { getCategories } from '@/backend/getCategories';
import { getPriceHistory } from "@/backend/getPriceHistory";
import type { EnrichedMeal } from '@/types/app';
import { notFound } from 'next/navigation';

async function getMeal(mealName: string): Promise<EnrichedMeal> {
  const allMeals = await getPriceHistory();
  const meal = allMeals.find((meal) => meal.name === mealName);
  if (!meal) {
    notFound();
  }

  const categories = await getCategories();
  const category = categories[mealName];
  return {
    name: meal.name,
    prices: meal.prices,
    category,
    images: meal.images,
  };
}

export default getMeal;