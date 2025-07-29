import type { CurrencyCode } from '@/utils/currencyConverter';
import type { PriceHistoryItem } from '@/types/app';
import type { MergedPrice } from '@/types/db';
import clientConfig from '@/config/client';
import currencyConverter from '@/utils/currencyConverter';

function transformPriceHistoryItem(raw: MergedPrice): PriceHistoryItem {
  const currencyCode = !raw.currency || raw.currency === 'лв' ? 'BGN' : raw.currency as CurrencyCode;
  return ({
    date: new Date(raw.date),
    amount: parseFloat(raw.price),
    currencyCode,
  });
}

function transformPriceHistory(history: Array<MergedPrice>): PriceHistoryItem[] {
  return history
    .map(transformPriceHistoryItem)
    .filter((item, index, transformed) => {
      return index === 0 
        || currencyConverter(item, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE) !== currencyConverter(transformed[index - 1], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE);
    });
}

export default transformPriceHistory;