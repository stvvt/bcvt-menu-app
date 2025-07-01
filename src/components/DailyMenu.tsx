import { useState, useEffect } from 'react';
import { getMenu } from '@/backend/getMenu';

interface DailyMenuProps {
  date: Date;
}

export default function DailyMenu({ date }: DailyMenuProps) {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchMenu() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMenu(date);
        if (isMounted) {
          setMenuData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load menu data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMenu();

    return () => {
      isMounted = false;
    };
  }, [date]);

  if (loading) {
    return (
      <div>
        <pre>Loading menu data...</pre>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <pre>{JSON.stringify({ error }, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div>
      <pre>
        {JSON.stringify(menuData, null, 2)}
      </pre>
    </div>
  );
} 