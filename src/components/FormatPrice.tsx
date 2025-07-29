import type { PriceHistoryItem } from '@/types/app';
import type { CurrencyCode } from '@/utils/currencyConverter';
import currencyConverter from '@/utils/currencyConverter';
import { useFormatter } from 'next-intl';
import type { FC } from 'react';

type Props = {
  price: PriceHistoryItem;
  currency: CurrencyCode;
};
const FormatPrice: FC<Props> = ({ price, currency }) => {
  const format = useFormatter();
  const convertedAmount = currencyConverter(price, currency);
  return format.number(convertedAmount, { style: 'currency', currency });
};

export default FormatPrice;