'use server'

import fetchJson from '@/utils/fetchJson';
import { getCategories } from './getCategories';
import { getPriceHistory } from './getPriceHistory';
import config from '@/config';
import type { DailyMenu, MergedMealItem } from '@/types/db';
import type { EnrichedMeal } from '@/types/app';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mock = (meals: EnrichedMeal[], name: string, date?: string, price?: string) => {
  const x = meals.find(meal => meal.name === name); 

  if (x) {
    x.prices.push({
      dateText: date || '2025-07-07',
      date: date || '2025-07-07',
      price: price || '10.00',
      currency: 'лв',
    });
  }
};

export async function getMenu(date: Date) {
  try {
    // Format the date as needed for the URL (adjust format as required)
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    // await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Replace with your actual API endpoint URL
    const url = `${config.DATA_BASE_URL}/daily/${formattedDate}.json`;
    
    const menuData = await fetchJson<DailyMenu>(url, {
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    // Fetch categories and price history data
    const [categories, priceHistoryData] = await Promise.all([
      getCategories(),
      getPriceHistory()
    ]);
    
    // Create a map of price history by meal name for efficient lookup
    const priceHistoryMap = new Map<string, MergedMealItem>();
    priceHistoryData.forEach((item) => {
      priceHistoryMap.set(item.name, item);
    });
    
    // Enrich menu data with categories and price history
    const enrichedMeals = menuData.meals?.map((meal) => {
      return {
        name: meal.name,
        category: categories[meal.name],
        prices: priceHistoryMap.get(meal.name)?.prices ?? [],
        images: priceHistoryMap.get(meal.name)?.images ?? []
      }
    }) || [];

    // mock(enrichedMeals, 'Болярска закуска с наденица');
    // mock(enrichedMeals, 'Сандвич с кайма и кашкавал', '2025-07-05', '3.00');
    // mock(enrichedMeals, 'Сандвич с кайма и кашкавал', '2025-07-07', '5.00');

    // Define category order
    const categoryOrder = [
      'закуски',
      'супи', 
      'салати',
      'предястия',
      'основни ястия',
      'гарнитури',
      'десерти',
      'напитки'
    ];

    // Group meals by category
    const mealsByCategory = enrichedMeals.reduce<Record<string, EnrichedMeal[]>>((acc, meal) => {
      if (!meal.category) return acc;
      
      if (!acc[meal.category]) {
        acc[meal.category] = [];
      }
      acc[meal.category].push(meal);
      return acc;
    }, {});
    
    // Return groups in the specified order with meals sorted by price
    const groupedByCategory = categoryOrder
      .filter(category => mealsByCategory[category]?.length > 0)
      .map(category => {
        return {
          category,
          meals: mealsByCategory[category].sort((a, b) => parseFloat(`${a.prices[a.prices.length - 1].price}`) - parseFloat(`${b.prices[b.prices.length - 1].price}`)),
        }
      });
    
    return groupedByCategory;
    
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw new Error('Failed to fetch menu data');
  }
} 