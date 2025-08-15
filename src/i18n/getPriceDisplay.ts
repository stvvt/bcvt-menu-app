import type { PriceHistoryItem } from '@/types/app';
import { differenceInDays } from 'date-fns';

const getPriceDisplay = (priceHistoryItem: PriceHistoryItem) => {
  if (differenceInDays(priceHistoryItem.date, new Date()) < -3) {
    return undefined;
  }

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
  
  return undefined;
};

export default getPriceDisplay;

