import type { MergedMealItem } from './db';

export type EnrichedMeal = MergedMealItem & {
  category: string;
};