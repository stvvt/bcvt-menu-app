import type { CurrencyCode } from '@/utils/currencyConverter';
import type { MergedMealItem, MealLocaleInfo } from './db';

export type PriceHistoryItem = {
  date: Date;
  amount: number;
  currencyCode: CurrencyCode;
  // delta is the difference between the current and previous price in the same currency
  delta: number;
  weight?: string;
  unit?: string;
}

export type EnrichedMeal = Omit<MergedMealItem, 'prices'> & {
  category: string;
  prices: PriceHistoryItem[];
  info?: MealLocaleInfo;
};