'use server'

import { getCategories } from './getCategories';
import { MealGroup, type Meal } from '@/types/Meal';

export async function getMenu(date: Date): Promise<MealGroup[]> {
  try {
    // Format the date as needed for the URL (adjust format as required)
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    // await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Replace with your actual API endpoint URL
    const url = `https://raw.githubusercontent.com/stvvt/bcvt-menu-scraper/refs/heads/main/db/daily/${formattedDate}.json`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${response.status} ${response.statusText}`);
    }

    const menuData = await response.json();
    
    // Fetch categories and enrich menu data
    const categories = await getCategories();
    
    // Enrich menu data with categories
    const enrichedMeals: Meal[] = menuData.meals?.map((meal: Meal) => ({
      ...meal,
      category: categories[meal.name]
    })) || [];
    
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
    const mealsByCategory = enrichedMeals.reduce((acc: Record<string, Meal[]>, meal: Meal) => {
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