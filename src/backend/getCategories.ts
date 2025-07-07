'use server'

import fetchJson from '@/utils/fetchJson';

export async function getCategories() {
  try {
    // URL for categories data
    const url = `https://raw.githubusercontent.com/stvvt/bcvt-menu-scraper/refs/heads/main/db/categories.json`;
    
    const categoriesData = await fetchJson(url, {
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    return categoriesData;
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories data');
  }
} 