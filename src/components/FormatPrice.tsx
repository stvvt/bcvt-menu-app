import type { PriceHistoryItem } from '@/types/app';
import type { CurrencyCode } from '@/utils/currencyConverter';
import currencyConverter from '@/utils/currencyConverter';
import { Text } from '@chakra-ui/react';
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
        <Text as="span" fontSize="xs">
          {' '}({percent > 0 ? `+${percent}%` : percent < 0 ? `-${percent}%` : ''})
          </Text>
      </>;
  }

  return format.number(convertedAmount, { style: 'currency', currency });
};

export default FormatPrice;