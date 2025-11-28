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
  if (showDelta && percent != 0) {
      return <>
        {format.number(convertedAmount, { style: 'currency', currency })}
        <span className="text-xs">
          {' '}({percent > 0 ? `+${percent}%` : percent < 0 ? `${percent}%` : ''})
        </span>
      </>;
  }

  return format.number(convertedAmount, { style: 'currency', currency });
};

export default FormatPrice;