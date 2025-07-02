'use server'

export async function getCategories() {
  try {
    // URL for categories data
    const url = `https://raw.githubusercontent.com/stvvt/bcvt-menu-scraper/refs/heads/main/db/categories.json`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control if needed
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }

    const categoriesData = await response.json();
    return categoriesData;
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories data');
  }
} 