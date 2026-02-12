'use server'

import { getVenueOrThrow } from '@/config/venues';
import fetchJson from '@/utils/fetchJson';
import { Categories } from '@/types/db';

export async function getCategories(venueId: string) {
  const venue = getVenueOrThrow(venueId);
  
  try {
    // URL for categories data
    const url = `${venue.dataUrl}/categories.json`;
    
    const categoriesData = await fetchJson<Categories>(url, {
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    return categoriesData;
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories data');
  }
} 