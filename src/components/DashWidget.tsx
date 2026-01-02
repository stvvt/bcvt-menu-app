import { type FC } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDistanceToNow } from 'date-fns';
import type { EnrichedMeal } from '@/types/app';
import clientConfig from '@/config/client';
import currencyConverter from '@/utils/currencyConverter';
import FormatPrice from '@/components/FormatPrice';
import getMealPrices from '@/utils/getMealPrices';
import { cn } from '@/lib/utils';

interface DashWidgetProps {
  meal: EnrichedMeal;
  refDate: Date;
}

const DashWidget: FC<DashWidgetProps> = ({ meal, refDate }) => {
  const priceHistory = getMealPrices(meal, refDate);

  if (priceHistory.length <= 1) {
    return null;
  }

  // Limit to last 10 entries
  const limitedPriceHistory = priceHistory.slice(-10);

  const getColorForPriceChange = (currentAmount: number, previousAmount: number) => {
    if (currentAmount > previousAmount) return 'bg-red-400';
    if (currentAmount < previousAmount) return 'bg-green-400';
    return 'bg-gray-300';
  };

  return (
    <div>
      <div className="flex gap-1">
        {limitedPriceHistory.map((item, index) => {
          if (index === 0) {
            return null;
          }

          const currentAmount = currencyConverter(item, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE);
          const previousAmount = index > 0 ? currencyConverter(limitedPriceHistory[index - 1], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE) : currentAmount;

          if (currentAmount === previousAmount) {
            return null;
          }

          const colorClass = index === 0 ? 'bg-gray-300' : getColorForPriceChange(currentAmount, previousAmount);
          const timeAgo = formatDistanceToNow(new Date(item.date), { addSuffix: true });
          const previousPrice = limitedPriceHistory[index - 1];
          
          return (
            <Popover key={`${item.date}-${index}`}>
              <PopoverTrigger asChild>
                <button
                  className={cn("w-3 h-1 rounded-sm cursor-pointer border-none p-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500", colorClass)}
                  aria-label={`Price changed ${timeAgo}`}
                />
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-3">
                  <div className="text-sm">
                    <FormatPrice price={previousPrice} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE}/>
                    {' → '}
                    <FormatPrice price={item} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE}/>
                    {' '}
                    <span className="text-xs text-muted-foreground">{timeAgo}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
};

export default DashWidget; 