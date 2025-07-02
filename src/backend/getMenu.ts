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
    const enrichedMeals = menuData.meals?.map((meal: Meal) => ({
      ...meal,
      category: categories[meal.name]
    })) || [];
    
    // Group meals by category
    const groupedByCategory = enrichedMeals.reduce((acc: any, meal: any) => {
      if (!meal.category) return acc;
      
      const existingGroup = acc.find((group: any) => group.category === meal.category);
      if (existingGroup) {
        existingGroup.meals.push(meal);
      } else {
        acc.push({
          category: meal.category,
          meals: [meal]
        });
      }
      return acc;
    }, []);
    
    return groupedByCategory;
    
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw new Error('Failed to fetch menu data');
  }
} 