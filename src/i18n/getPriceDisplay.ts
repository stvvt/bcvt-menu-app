import type { PriceHistoryItem } from '@/types/app';

const getPriceDisplay = (priceHistoryItem: PriceHistoryItem) => {
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

