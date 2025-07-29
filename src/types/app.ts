import type { CurrencyCode } from '@/utils/currencyConverter';
import type { MergedMealItem } from './db';

export type PriceHistoryItem = {
  date: Date;
  amount: number;
  currencyCode: CurrencyCode;
}

export type EnrichedMeal = Omit<MergedMealItem, 'prices'> & {
  category: string;
  prices: PriceHistoryItem[];
};