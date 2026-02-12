import type { EnrichedMeal, PriceComparison, VenuePriceData } from '@/types/app';
import type { VenueClientConfig } from '@/config/venues.client';

export interface VenueMealsData {
  venue: VenueClientConfig;
  meals: EnrichedMeal[];
}

export function buildPriceComparison(
  venueData: VenueMealsData[]
): PriceComparison[] {
  // Collect all unique meal names across venues
  const mealNames = new Set<string>();
  for (const { meals } of venueData) {
    for (const meal of meals) {
      mealNames.add(meal.name);
    }
  }

  // Build comparison for each meal
  const comparisons: PriceComparison[] = [];

  for (const mealName of mealNames) {
    const venuesPriceData: VenuePriceData[] = [];

    for (const { venue, meals } of venueData) {
      const meal = meals.find(m => m.name === mealName);
      
      if (meal && meal.prices.length > 0) {
        const sortedPrices = [...meal.prices].sort(
          (a, b) => b.date.getTime() - a.date.getTime()
        );
        
        venuesPriceData.push({
          venueId: venue.id,
          venueName: venue.name,
          currentPrice: sortedPrices[0] || null,
          priceHistory: meal.prices,
        });
      }
    }

    // Only include meals that exist in at least 2 venues
    if (venuesPriceData.length >= 2) {
      comparisons.push({
        mealName,
        venues: venuesPriceData,
      });
    }
  }

  // Sort by number of venues (most common first)
  comparisons.sort((a, b) => b.venues.length - a.venues.length);

  return comparisons;
}

export function findCheapestVenue(comparison: PriceComparison): VenuePriceData | null {
  const withPrices = comparison.venues.filter(v => v.currentPrice !== null);
  if (withPrices.length === 0) return null;

  return withPrices.reduce((cheapest, current) => {
    if (!cheapest.currentPrice) return current;
    if (!current.currentPrice) return cheapest;
    return current.currentPrice.amount < cheapest.currentPrice.amount ? current : cheapest;
  });
}

export function findMostExpensiveVenue(comparison: PriceComparison): VenuePriceData | null {
  const withPrices = comparison.venues.filter(v => v.currentPrice !== null);
  if (withPrices.length === 0) return null;

  return withPrices.reduce((expensive, current) => {
    if (!expensive.currentPrice) return current;
    if (!current.currentPrice) return expensive;
    return current.currentPrice.amount > expensive.currentPrice.amount ? current : expensive;
  });
}
