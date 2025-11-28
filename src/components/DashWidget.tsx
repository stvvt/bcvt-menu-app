import { type FC } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDistanceToNow } from 'date-fns';
import type { EnrichedMeal } from '@/types/app';
import clientConfig from '@/config/client';
import currencyConverter from '@/utils/currencyConverter';
import FormatPrice from '@/components/FormatPrice';
import getMealPrices from '@/utils/getMealPrices';

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
    if (currentAmount > previousAmount) return 'rgb(248 113 113)'; // red-400
    if (currentAmount < previousAmount) return 'rgb(74 222 128)'; // green-400
    return 'rgb(209 213 219)'; // gray-300
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

          const color = index === 0 ? 'rgb(209 213 219)' : getColorForPriceChange(currentAmount, previousAmount);
          const timeAgo = formatDistanceToNow(new Date(item.date), { addSuffix: true });
          
          return (
            <Popover key={`${item.date}-${index}`}>
              <PopoverTrigger>
                <div
                  className="w-3 h-1 rounded-sm cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-3">
                  <div className="text-sm">
                    <FormatPrice price={limitedPriceHistory[index-1]} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE}/>
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