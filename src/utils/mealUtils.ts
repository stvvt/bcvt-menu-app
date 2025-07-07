import { Meal } from '@/types/Meal';

/**
 * Returns the most recent price history item with date prior or equal to refDate
 * @param meal - The meal object containing price history
 * @param refDate - The reference date to compare against
 * @returns The most recent price history item or undefined if none found
 */
export function getMealPriceAt(meal: Meal, refDate: Date) {
  const { priceHistory } = meal;
  
  if (!priceHistory || priceHistory.length === 0) {
    return undefined;
  }
  
  // Filter items with date <= refDate
  const validItems = priceHistory.filter(item => new Date(item.date) <= refDate);
  
  if (validItems.length === 0) {
    return undefined;
  }
  
  // Sort by date descending and return the most recent one
  const sortedItems = validItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return sortedItems[0];
} 