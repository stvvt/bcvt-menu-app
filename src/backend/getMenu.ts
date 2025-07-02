'use server'

export async function getMenu(date: Date) {
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
    return menuData;
    
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw new Error('Failed to fetch menu data');
  }
} 