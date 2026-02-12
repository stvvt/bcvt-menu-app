import { calculateAnalyticsSummary } from '../../src/utils/analyticsCalculations';
import type { EnrichedMeal, PriceHistoryItem } from '../../src/types/app';

// Helper to create a price history item
function createPrice(
  dateStr: string,
  amount: number,
  delta: number = 0
): PriceHistoryItem {
  return {
    date: new Date(dateStr),
    amount,
    currencyCode: 'BGN',
    delta,
  };
}

// Helper to create a meal
function createMeal(
  name: string,
  category: string,
  prices: PriceHistoryItem[]
): EnrichedMeal {
  return {
    name,
    category,
    prices,
    images: [],
  };
}

describe('calculateAnalyticsSummary', () => {
  const periodStart = new Date('2025-01-01');
  const periodEnd = new Date('2025-03-31');

  describe('avgPriceChangeComparable', () => {
    it('should exclude new items with no price changes from avgPriceChangeComparable', () => {
      const meals: EnrichedMeal[] = [
        // Existing item with 10% increase (first price before period)
        createMeal('existing-changed', 'закуски', [
          createPrice('2024-12-01', 10, 0),    // Before period
          createPrice('2025-02-01', 11, 0.10), // 10% increase
        ]),
        // New item with no changes (first price within period, no delta)
        createMeal('new-unchanged', 'супи', [
          createPrice('2025-01-15', 5, 0),     // First appearance, no change
        ]),
      ];

      const summary = calculateAnalyticsSummary(meals, periodStart, periodEnd);

      // avgPriceChange includes all items: (10% + 0%) / 2 = 5%
      expect(summary.avgPriceChange).toBe(5);
      
      // avgPriceChangeComparable excludes the new item with no changes: 10% / 1 = 10%
      expect(summary.avgPriceChangeComparable).toBe(10);
    });

    it('should include new items WITH price changes in avgPriceChangeComparable', () => {
      const meals: EnrichedMeal[] = [
        // Existing item with 10% increase
        createMeal('existing-changed', 'закуски', [
          createPrice('2024-12-01', 10, 0),
          createPrice('2025-02-01', 11, 0.10),
        ]),
        // New item WITH changes (first price within period, has delta)
        createMeal('new-changed', 'супи', [
          createPrice('2025-01-15', 5, 0),     // First appearance
          createPrice('2025-02-15', 6, 0.20),  // 20% increase
        ]),
      ];

      const summary = calculateAnalyticsSummary(meals, periodStart, periodEnd);

      // avgPriceChange includes all: (10% + 20%) / 2 = 15%
      expect(summary.avgPriceChange).toBe(15);
      
      // avgPriceChangeComparable also includes both (new item had changes): (10% + 20%) / 2 = 15%
      expect(summary.avgPriceChangeComparable).toBe(15);
    });

    it('should include existing stable items in avgPriceChangeComparable', () => {
      const meals: EnrichedMeal[] = [
        // Existing item with 10% increase
        createMeal('existing-changed', 'закуски', [
          createPrice('2024-12-01', 10, 0),
          createPrice('2025-02-01', 11, 0.10),
        ]),
        // Existing stable item (first price before period, no changes in period)
        createMeal('existing-stable', 'супи', [
          createPrice('2024-12-01', 8, 0),     // Before period
          createPrice('2025-01-05', 8, 0),     // Same price in period
        ]),
      ];

      const summary = calculateAnalyticsSummary(meals, periodStart, periodEnd);

      // avgPriceChange includes all: (10% + 0%) / 2 = 5%
      expect(summary.avgPriceChange).toBe(5);
      
      // avgPriceChangeComparable also includes existing stable item: (10% + 0%) / 2 = 5%
      expect(summary.avgPriceChangeComparable).toBe(5);
    });

    it('should handle multiple new listings correctly', () => {
      const meals: EnrichedMeal[] = [
        // Existing item with 20% increase
        createMeal('existing-changed', 'закуски', [
          createPrice('2024-12-01', 10, 0),
          createPrice('2025-02-01', 12, 0.20),
        ]),
        // New item with no changes (should be excluded)
        createMeal('new-unchanged-1', 'супи', [
          createPrice('2025-01-15', 5, 0),
        ]),
        // New item with no changes (should be excluded)
        createMeal('new-unchanged-2', 'салати', [
          createPrice('2025-02-01', 7, 0),
        ]),
        // New item WITH changes (should be included)
        createMeal('new-changed', 'десерти', [
          createPrice('2025-01-20', 4, 0),
          createPrice('2025-03-01', 5, 0.25), // 25% increase
        ]),
      ];

      const summary = calculateAnalyticsSummary(meals, periodStart, periodEnd);

      // avgPriceChange: (20% + 0% + 0% + 25%) / 4 = 11.25%
      expect(summary.avgPriceChange).toBe(11.25);
      
      // avgPriceChangeComparable excludes 2 new unchanged items: (20% + 25%) / 2 = 22.5%
      expect(summary.avgPriceChangeComparable).toBe(22.5);
    });

    it('should return 0 when all items are new listings with no changes', () => {
      const meals: EnrichedMeal[] = [
        createMeal('new-1', 'закуски', [
          createPrice('2025-01-15', 5, 0),
        ]),
        createMeal('new-2', 'супи', [
          createPrice('2025-02-01', 7, 0),
        ]),
      ];

      const summary = calculateAnalyticsSummary(meals, periodStart, periodEnd);

      expect(summary.avgPriceChange).toBe(0);
      expect(summary.avgPriceChangeComparable).toBe(0);
    });
  });
});
