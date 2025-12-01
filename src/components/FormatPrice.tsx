import type { PriceHistoryItem } from '@/types/app';
import type { CurrencyCode } from '@/utils/currencyConverter';
import currencyConverter from '@/utils/currencyConverter';
// No UI imports needed - using plain JSX
import { useFormatter } from 'next-intl';
import type { FC } from 'react';

type Props = {
  price: PriceHistoryItem;
  currency: CurrencyCode;
  showDelta?: boolean;
};
const FormatPrice: FC<Props> = ({ price, currency, showDelta = false }) => {
  const format = useFormatter();
  const convertedAmount = currencyConverter(price, currency);
  const percent = Math.round(price.delta * 100);
  const arrow = percent > 0 ? '↗' : percent < 0 ? '↘' : '';
  if (showDelta && percent != 0) {
      return <>
        <span className="text-xs text-muted-foreground font-normal">
          {arrow}{`${Math.abs(percent)}%`}
        </span>
        {' '}
        {format.number(convertedAmount, { style: 'currency', currency })}
      </>;
  }

  return format.number(convertedAmount, { style: 'currency', currency });
};

export default FormatPrice;