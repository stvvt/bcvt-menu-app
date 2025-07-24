import type { Price } from '@/types/db';
import type { CurrencyCode } from '@/utils/currencyConverter';
import currencyConverter from '@/utils/currencyConverter';
import { useFormatter } from 'next-intl';
import type { FC } from 'react';

type Props = {
  price: Price;
  currency: CurrencyCode;
};
const FormatPrice: FC<Props> = ({ price, currency }) => {
  const format = useFormatter();
  const convertedPrice = currencyConverter(price, currency);
  return format.number(convertedPrice.amount, { style: 'currency', currency: convertedPrice.currency });
};

export default FormatPrice;