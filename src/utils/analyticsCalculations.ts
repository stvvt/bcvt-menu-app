import type { EnrichedMeal, PriceHistoryItem, MealPriceStats, AnalyticsSummary } from '@/types/app';

export function filterPricesByDateRange(
  prices: PriceHistoryItem[],
  from: Date,
  to: Date
): PriceHistoryItem[] {
  return prices.filter(p => p.date >= from && p.date <= to);
}

export function calculateMealStats(
  meal: EnrichedMeal,
  from: Date,
  to: Date
): MealPriceStats | null {
  const filteredPrices = filterPricesByDateRange(meal.prices, from, to);
  
  if (filteredPrices.length === 0) {
    return null;
  }

  const amounts = filteredPrices.map(p => p.amount);
  const avgPrice = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const minPrice = Math.min(...amounts);
  const maxPrice = Math.max(...amounts);
  
  // Calculate price change (first to last in period)
  const sortedPrices = [...filteredPrices].sort((a, b) => a.date.getTime() - b.date.getTime());
  const firstPrice = sortedPrices[0].amount;
  const lastPrice = sortedPrices[sortedPrices.length - 1].amount;
  const priceChange = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;

  // Calculate volatility (standard deviation)
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avgPrice, 2), 0) / amounts.length;
  const volatility = Math.sqrt(variance);

  return {
    mealName: meal.name,
    category: meal.category,
    currentPrice: lastPrice,
    currencyCode: filteredPrices[0].currencyCode,
    avgPrice,
    minPrice,
    maxPrice,
    priceChange,
    volatility,
    dataPoints: filteredPrices.length,
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

  for (const meal of meals) {
    const stats = calculateMealStats(meal, from, to);
    if (stats) {
      mealStats.push(stats);

      // Aggregate category data
      if (!categoryData[meal.category]) {
        categoryData[meal.category] = { prices: [], count: 0 };
      }
      categoryData[meal.category].prices.push(stats.currentPrice);
      categoryData[meal.category].count++;
    }

    // Check if this is a new item (first price within the date range)
    const sortedPrices = [...meal.prices].sort((a, b) => a.date.getTime() - b.date.getTime());
    if (sortedPrices.length > 0 && sortedPrices[0].date >= from && sortedPrices[0].date <= to) {
      newItems.push(meal);
    }
  }

  // Sort by price change
  const sortedByChange = [...mealStats].sort((a, b) => b.priceChange - a.priceChange);
  const biggestIncreases = sortedByChange.filter(s => s.priceChange > 0).slice(0, 5);
  const biggestDecreases = sortedByChange.filter(s => s.priceChange < 0).slice(-5).reverse();

  // Calculate average price change
  const avgPriceChange = mealStats.length > 0
    ? mealStats.reduce((sum, s) => sum + s.priceChange, 0) / mealStats.length
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
  };
}
