import { z } from 'zod';
import { CurrencyCodeSchema } from '@/config/client';
import type { PriceHistoryItem } from '@/types/app';

export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function currencyConverter(price: PriceHistoryItem, to: CurrencyCode) {
  return convert(price.amount, price.currencyCode, to);
}

export function convert(amount: number, from: CurrencyCode, to: CurrencyCode) {
  const rate = from === 'BGN' && to === 'EUR' 
    ? 1.95583 : from === 'EUR' && to === 'BGN'
    ? 0.51135 : 1;

  return roundTo(amount / rate, 2);
}

export default currencyConverter;