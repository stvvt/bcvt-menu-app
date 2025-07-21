'use server'

import fetchJson from '@/utils/fetchJson';
import { getCategories } from './getCategories';
import { getPriceHistory } from './getPriceHistory';
import { MealGroup, type Meal } from '@/types/Meal';
import { PriceHistoryItem } from '@/types/PriceHistoryItem';
import config from '@/config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mock = (meals: Meal[], name: string, date?: string, price?: string) => {
  const x = meals.find(meal => meal.name === name); 

  if (x) {
    x.priceHistory.push({
      dateText: date || '2025-07-07',
      date: date || '2025-07-07',
      price: price || '10.00',
      currency: 'лв',
    });
  }
};

type MenuData = {
  date: string;
  meals: Omit<Meal, 'priceHistory' | 'category'>[];
};

export async function getMenu(date: Date): Promise<MealGroup[]> {
  try {
    // Format the date as needed for the URL (adjust format as required)
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    // await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Replace with your actual API endpoint URL
    const url = `${config.DATA_BASE_URL}/daily/${formattedDate}.json`;
    
    const menuData = await fetchJson<MenuData>(url, {
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    // Fetch categories and price history data
    const [categories, priceHistoryData] = await Promise.all([
      getCategories(),
      getPriceHistory()
    ]);
    
    // Create a map of price history by meal name for efficient lookup
    const priceHistoryMap = new Map<string, PriceHistoryItem['prices']>();
    priceHistoryData.forEach((item: PriceHistoryItem) => {
      priceHistoryMap.set(item.name, item.prices);
    });
    
    // Enrich menu data with categories and price history
    const enrichedMeals: Meal[] = menuData.meals?.map((meal) => ({
      ...meal,
      category: categories[meal.name],
      priceHistory: priceHistoryMap.get(meal.name) || []
    })) || [];

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
    const mealsByCategory = enrichedMeals.reduce<Record<string, Meal[]>>((acc, meal) => {
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
      .map(category => ({
        category,
        meals: mealsByCategory[category].sort((a, b) => parseFloat(`${a.price}`) - parseFloat(`${b.price}`))
      }));
    
    return groupedByCategory;
    
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw new Error('Failed to fetch menu data');
  }
} 