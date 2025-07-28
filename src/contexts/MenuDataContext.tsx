'use client';

import { getMenu } from '@/backend/getMenu';
import type { EnrichedMeal } from '@/types/app';
import type { MergedMealItem } from '@/types/db';
import { useRouter, useSearchParams } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type FC, type PropsWithChildren } from "react";

type MenuDataContextType = {
  date: Date | undefined;
  loadingDate: Date;
  changeDate: (date: Date | null) => void;
  menuData: MealGroup[] | null;
  error: string | null;
  loading: boolean;
  getMealPrices: (meal: EnrichedMeal, refDate?: Date) => MergedMealItem['prices'];
};

type MealGroup = {
  category?: string;
  meals: EnrichedMeal[];
};

const MenuDataContext = createContext<MenuDataContextType | null>(null);

const MenuDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const [menuData, setMenuData] = useState<MealGroup[] | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();

  const loadingDate = useMemo(() => dateParam ? new Date(dateParam) : new Date(), [dateParam]);

  const changeDate = useCallback((date: Date | null) => {
    date = date || new Date();
    const params = new URLSearchParams(searchParams);
    params.set('date', date.toISOString().split('T')[0]);
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  const getMealPrices = useCallback((meal: EnrichedMeal, refDate?: Date) => {
    if (!refDate) {
      return meal.prices;
    }
    return meal.prices.filter(item => refDate >= new Date(item.date));
  }, []);


  useEffect(() => {
    async function fetchMenu() {
      try {
        setFetching(true);
        setError(null);
        const data = await getMenu(loadingDate);
        setMenuData(data);
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }
        setError(`Failed to load menu data ${err.message}`);
        setMenuData(null);
      } finally {
        setFetching(false);
        setDate(loadingDate);
      }
    }

    fetchMenu();
  }, [loadingDate]);

  const loading = useMemo(() => fetching || !error && (!date || !menuData), [date, menuData, error, fetching]);

  return (
    <MenuDataContext.Provider
      value={{ date, loadingDate, changeDate, menuData, error, loading, getMealPrices }}>
        {children}
    </MenuDataContext.Provider>
  );
};

export default MenuDataProvider;

export const useMenuData = () => {
  const context = useContext(MenuDataContext);
  if (!context) {
    throw new Error('useMenuData must be used within a MenuDataProvider');
  }
  return context;
};
