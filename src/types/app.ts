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

// Multi-venue types
export interface VenueMeal extends EnrichedMeal {
  venueId: string;
}

export interface VenuePriceData {
  venueId: string;
  venueName: string;
  currentPrice: PriceHistoryItem | null;
  priceHistory: PriceHistoryItem[];
}

export interface PriceComparison {
  mealName: string;
  venues: VenuePriceData[];
}

// Analytics types
export interface PriceStats {
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  priceChange: number;      // Percentage change over period
  volatility: number;       // Standard deviation of prices
  dataPoints: number;
}

export interface MealPriceStats extends PriceStats {
  mealName: string;
  localizedName?: string;
  category: string;
  currentPrice: number;
  currencyCode: CurrencyCode;
}

export interface AnalyticsSummary {
  totalMeals: number;
  avgPriceChange: number;
  avgPriceChangeComparable: number;  // Excludes new listings (new items with no price changes)
  biggestIncreases: MealPriceStats[];
  biggestDecreases: MealPriceStats[];
  newItems: EnrichedMeal[];
  categoryBreakdown: Record<string, { count: number; avgPrice: number }>;
  itemsWithIncreases: number;    // Count of items that had at least one price increase
  itemsWithDecreases: number;    // Count of items that had at least one price decrease
  totalIncreaseEvents: number;   // Total number of price increase events
  totalDecreaseEvents: number;   // Total number of price decrease events
}