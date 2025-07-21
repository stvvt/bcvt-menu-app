'use server'

import config from '@/config';
import fetchJson from '@/utils/fetchJson';

export async function getCategories() {
  try {
    // URL for categories data
    const url = `${config.DATA_BASE_URL}/categories.json`;
    
    const categoriesData = await fetchJson<Record<string, string>>(url, {
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    return categoriesData;
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories data');
  }
} 