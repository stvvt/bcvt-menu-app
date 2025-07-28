import type { EnrichedMeal } from '@/types/app';

function getMealPrices(meal: EnrichedMeal, refDate?: Date) {
  if (!refDate) {
    return meal.prices;
  }
  return meal.prices.filter(item => refDate >= new Date(item.date));
};

export default getMealPrices;
