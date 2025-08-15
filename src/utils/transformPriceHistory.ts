import type { CurrencyCode } from '@/utils/currencyConverter';
import type { PriceHistoryItem } from '@/types/app';
import type { MergedPrice } from '@/types/db';
import clientConfig from '@/config/client';
import currencyConverter from '@/utils/currencyConverter';

function transformPriceHistoryItem(raw: MergedPrice): PriceHistoryItem {
  const currencyCode = !raw.currency || raw.currency === 'лв' ? 'BGN' : raw.currency as CurrencyCode;
  return {
    date: new Date(raw.date),
    amount: parseFloat(raw.price),
    currencyCode,
    delta: 0,
    weight: raw.weight,
    unit: raw.unit,
  };
}

function transformPriceHistory(history: Array<MergedPrice>): PriceHistoryItem[] {
  const transformed = history
    .map(transformPriceHistoryItem)
    .map((item, index, transformed) => {
      return {
        ...item,
        delta: index > 0 ? currencyConverter(item, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE)/currencyConverter(transformed[index - 1], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE) - 1 : 0,
      };
    })
    .filter((item, index, transformed) => {
      if (index === 0) {
        return true;
      }
      const previousItem = transformed[index - 1];

      if (item.weight !== previousItem.weight || item.unit !== previousItem.unit) {
        return true;
      }

      return (item.delta > Number.EPSILON || item.delta < -Number.EPSILON);
    });

  return transformed;
}

export default transformPriceHistory;