'use client';

import { type FC } from 'react';
import { Link } from '@/i18n/navigation';
import type { MealGroup } from '@/backend/getMenu';
import type { EnrichedMeal, PriceHistoryItem } from '@/types/app';
import FormatPrice from '@/components/FormatPrice';
import { Badge } from '@/components/ui/badge';
import clientConfig from '@/config/client';
import { useTranslations } from 'next-intl';

type SurpriseItem = {
  meal: EnrichedMeal;
  currentPrice: PriceHistoryItem;
  previousPrice: PriceHistoryItem;
};

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getPriceSurprises(groups: MealGroup[], refDate: Date): SurpriseItem[] {
  const surprises: SurpriseItem[] = [];

  for (const group of groups) {
    for (const meal of group.meals) {
      // Get prices up to and including refDate
      const relevantPrices = meal.prices.filter(p => refDate >= new Date(p.date));
      
      if (relevantPrices.length < 2) continue;
      
      const currentPrice = relevantPrices[relevantPrices.length - 1];
      const previousPrice = relevantPrices[relevantPrices.length - 2];
      
      // Check if the most recent price change happened on refDate and has a delta
      if (isSameDay(new Date(currentPrice.date), refDate) && currentPrice.delta !== 0) {
        surprises.push({ meal, currentPrice, previousPrice });
      }
    }
  }

  return surprises;
}

interface PriceSurprisesProps {
  menuData: MealGroup[];
  refDate: Date;
  venue: string;
}

const PriceSurprises: FC<PriceSurprisesProps> = ({ menuData, refDate, venue }) => {
  const t = useTranslations();
  const surprises = getPriceSurprises(menuData, refDate);

  if (surprises.length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {t('todaysSurprises')}
        <Badge className="text-sm px-3 py-1 bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-900">{surprises.length}</Badge>
      </h2>
      <ul className="space-y-2">
        {surprises.map(({ meal, currentPrice, previousPrice }) => {
          const percent = Math.round(currentPrice.delta * 100);
          const isIncrease = percent > 0;
          const arrow = isIncrease ? '↗' : '↘';

          return (
            <li key={meal.name} className="flex items-center justify-between gap-2">
              <Link 
                href={`/${venue}/${meal.name}`} 
                className="hover:underline font-medium flex-1 truncate"
              >
                {meal.info?.name || meal.name}
              </Link>
              <span className="text-sm text-gray-400 line-through">
                <FormatPrice price={previousPrice} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE} />
              </span>
              <span className={`text-sm ${isIncrease ? 'text-red-500' : 'text-green-500'}`}>
                {arrow} {Math.abs(percent)}%
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                <FormatPrice price={currentPrice} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE} />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PriceSurprises;
