import { getCategories } from '@/backend/getCategories';
import { getPriceHistory } from "@/backend/getPriceHistory";
import type { MealObject } from '@/types/Meal';
import { notFound } from 'next/navigation';

async function getMeal(mealName: string): Promise<MealObject> {
  const allMeals = await getPriceHistory();
  const meal = allMeals.find((meal) => meal.name === mealName);
  if (!meal) {
    notFound();
  }

  const categories = await getCategories();
  const category = categories[mealName];
  return {
    name: meal.name,
    priceHistory: meal.prices,
    category,
  };
}

export default getMeal;