'use client';

import type { CurrencyCode } from '@/utils/currencyConverter';
import { useFormatter } from 'next-intl';
import type { FC } from 'react';

type Props = {
  amount: number;
  currency: CurrencyCode;
};

/**
 * Formats an amount in the given currency using locale-aware conventions.
 * Uses next-intl / Intl.NumberFormat (e.g. "€ 1.48" for EUR, "1.48 лв" for BGN).
 */
const FormatCurrencyAmount: FC<Props> = ({ amount, currency }) => {
  const format = useFormatter();
  return <>{format.number(amount, { style: 'currency', currency })}</>;
};

export default FormatCurrencyAmount;
