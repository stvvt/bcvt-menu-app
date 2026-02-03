import type { EnrichedMeal, PriceHistoryItem, MealPriceStats, AnalyticsSummary } from '@/types/app';
import { convert } from '@/utils/currencyConverter';
import clientConfig from '@/config/client';

export function filterPricesByDateRange(
  prices: PriceHistoryItem[],
  from: Date,
  to: Date
): PriceHistoryItem[] {
  return prices.filter(p => p.date >= from && p.date <= to);
}

/**
 * Get the most recent price at or before the given date.
 * Returns null if no price exists before or at the date.
 */
export function getMostRecentPrice(
  prices: PriceHistoryItem[],
  asOf: Date
): PriceHistoryItem | null {
  const pricesUpToDate = prices.filter(p => p.date <= asOf);
  if (pricesUpToDate.length === 0) {
    return null;
  }
  // Sort descending by date and return the most recent
  return pricesUpToDate.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
}

// Minimum freshness window in days - items must have a price record within this window
// from the period end date to be considered "active" (still on the menu)
const MIN_FRESHNESS_DAYS = 90;

export function calculateMealStats(
  meal: EnrichedMeal,
  from: Date,
  to: Date
): MealPriceStats | null {
  // Get the most recent price at or before 'to' date - this determines if the meal is "active"
  const currentPriceEntry = getMostRecentPrice(meal.prices, to);
  
  // If no price exists at or before 'to', the meal doesn't exist yet in this period
  if (!currentPriceEntry) {
    return null;
  }

  // Calculate freshness window: use the larger of period length or MIN_FRESHNESS_DAYS
  const periodLengthMs = to.getTime() - from.getTime();
  const periodLengthDays = periodLengthMs / (1000 * 60 * 60 * 24);
  const freshnessWindowDays = Math.max(periodLengthDays, MIN_FRESHNESS_DAYS);
  const freshnessThreshold = new Date(to.getTime() - freshnessWindowDays * 24 * 60 * 60 * 1000);

  // Exclude items where the most recent price is older than the freshness window
  // (these items are likely discontinued)
  if (currentPriceEntry.date < freshnessThreshold) {
    return null;
  }

  // Get prices strictly within the date range for period-specific stats
  const pricesInRange = filterPricesByDateRange(meal.prices, from, to);
  
  // For avg/min/max, use prices in range if available, otherwise use current price
  const amounts = pricesInRange.length > 0 
    ? pricesInRange.map(p => p.amount) 
    : [currentPriceEntry.amount];
  
  const avgPrice = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const minPrice = Math.min(...amounts);
  const maxPrice = Math.max(...amounts);
  
  // Calculate price change (first to last in period)
  let priceChange = 0;
  if (pricesInRange.length > 1) {
    const sortedPrices = [...pricesInRange].sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstPrice = sortedPrices[0].amount;
    const lastPrice = sortedPrices[sortedPrices.length - 1].amount;
    priceChange = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;
  }

  // Calculate volatility (standard deviation)
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avgPrice, 2), 0) / amounts.length;
  const volatility = Math.sqrt(variance);

  return {
    mealName: meal.name,
    localizedName: meal.info?.name,
    category: meal.category,
    currentPrice: currentPriceEntry.amount,
    currencyCode: currentPriceEntry.currencyCode,
    avgPrice,
    minPrice,
    maxPrice,
    priceChange,
    volatility,
    dataPoints: pricesInRange.length > 0 ? pricesInRange.length : 1,
  };
}

export function calculateAnalyticsSummary(
  meals: EnrichedMeal[],
  from: Date,
  to: Date
): AnalyticsSummary {
  const mealStats: MealPriceStats[] = [];
  const categoryData: Record<string, { prices: number[]; count: number }> = {};
  const newItems: EnrichedMeal[] = [];

  // Counters for price changes using delta field
  let itemsWithIncreases = 0;
  let itemsWithDecreases = 0;
  let totalIncreaseEvents = 0;
  let totalDecreaseEvents = 0;

  for (const meal of meals) {
    const stats = calculateMealStats(meal, from, to);
    if (stats) {
      mealStats.push(stats);

      // Aggregate category data (convert to base currency)
      if (!categoryData[meal.category]) {
        categoryData[meal.category] = { prices: [], count: 0 };
      }
      const convertedPrice = convert(stats.currentPrice, stats.currencyCode, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE);
      categoryData[meal.category].prices.push(convertedPrice);
      categoryData[meal.category].count++;
    }

    // Count price changes using delta field within the date range
    const filteredPrices = filterPricesByDateRange(meal.prices, from, to);
    const increases = filteredPrices.filter(p => p.delta > Number.EPSILON);
    const decreases = filteredPrices.filter(p => p.delta < -Number.EPSILON);

    if (increases.length > 0) itemsWithIncreases++;
    if (decreases.length > 0) itemsWithDecreases++;
    totalIncreaseEvents += increases.length;
    totalDecreaseEvents += decreases.length;

    // Check if this is a new item (first price within the date range)
    const sortedPrices = [...meal.prices].sort((a, b) => a.date.getTime() - b.date.getTime());
    if (sortedPrices.length > 0 && sortedPrices[0].date >= from && sortedPrices[0].date <= to) {
      newItems.push(meal);
    }
  }

  // Sort by price change - use max delta within period for better accuracy
  // Recalculate price change based on max delta within period for sorting
  const mealStatsWithDelta = mealStats.map(stat => {
    const meal = meals.find(m => m.name === stat.mealName);
    if (!meal) return stat;
    const filteredPrices = filterPricesByDateRange(meal.prices, from, to);
    const maxDelta = filteredPrices.reduce((max, p) => Math.max(max, p.delta), 0);
    const minDelta = filteredPrices.reduce((min, p) => Math.min(min, p.delta), 0);
    // Use the larger absolute change for sorting
    const effectiveDelta = Math.abs(maxDelta) >= Math.abs(minDelta) ? maxDelta : minDelta;
    return { ...stat, priceChange: effectiveDelta * 100 };
  });

  const sortedByChange = [...mealStatsWithDelta].sort((a, b) => b.priceChange - a.priceChange);
  const biggestIncreases = sortedByChange.filter(s => s.priceChange > 0).slice(0, 5);
  const biggestDecreases = sortedByChange.filter(s => s.priceChange < 0).slice(-5).reverse();

  // Calculate average price change
  const avgPriceChange = mealStatsWithDelta.length > 0
    ? mealStatsWithDelta.reduce((sum, s) => sum + s.priceChange, 0) / mealStatsWithDelta.length
    : 0;

  // Build category breakdown
  const categoryBreakdown: Record<string, { count: number; avgPrice: number }> = {};
  for (const [category, data] of Object.entries(categoryData)) {
    categoryBreakdown[category] = {
      count: data.count,
      avgPrice: data.prices.reduce((a, b) => a + b, 0) / data.prices.length,
    };
  }

  return {
    totalMeals: mealStats.length,
    avgPriceChange,
    biggestIncreases,
    biggestDecreases,
    newItems,
    categoryBreakdown,
    itemsWithIncreases,
    itemsWithDecreases,
    totalIncreaseEvents,
    totalDecreaseEvents,
  };
}
