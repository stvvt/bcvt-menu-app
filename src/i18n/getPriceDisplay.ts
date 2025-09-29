import type { PriceHistoryItem } from '@/types/app';
import { differenceInDays } from 'date-fns';

const getPriceDisplay = (priceHistoryItem: PriceHistoryItem, refDate: Date) => {
  const daysSinceLastPrice = differenceInDays(refDate, priceHistoryItem.date);

  if (daysSinceLastPrice < 3) {
    if (priceHistoryItem.delta > Number.EPSILON) {
      return {
        arrow: '↗',
        color: 'red.500'
      };
    } else if (priceHistoryItem.delta < -Number.EPSILON) {
      return {
        arrow: '↘',
        color: 'green.500'
      };
    }
  }
  
  return undefined;
};

export default getPriceDisplay;

