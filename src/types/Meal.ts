import { PriceHistoryItem } from './PriceHistoryItem';

export type MealObject = {
  name: string;
  category?: string;
  imageUrl?: string;
  priceHistory: PriceHistoryItem['prices'];
};

export type Meal = MealObject & {
  price: string;
  currency?: string;
  ean?: string;
};

export type MealGroup = {
  category?: string;
  meals: Meal[];
};
