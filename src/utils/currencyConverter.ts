import { z } from 'zod';
import type { Price } from '@/types/db';
import { CurrencyCodeSchema } from '@/config/client';

export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function currencyConverter(price: Price, to: CurrencyCode) {
  const from = price.currency === 'лв' || !price.currency ? 'BGN' : price.currency as CurrencyCode;
  const rate = from === 'BGN' && to === 'EUR' 
    ? 1.95583 : from === 'EUR' && to === 'BGN'
    ? 0.51135 : 1;

  return {
    amount: roundTo(Number(price.price) / rate, 2),
    currency: to
  };
}

export default currencyConverter;