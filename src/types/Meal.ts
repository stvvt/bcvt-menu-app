import { PriceHistoryItem } from './PriceHistoryItem';

export type Meal = {
  name: string;
  price: string;
  currency?: string;
  category?: string;
  priceHistory: PriceHistoryItem['prices'];
};

export type MealGroup = {
  category?: string;
  meals: Meal[];
};
