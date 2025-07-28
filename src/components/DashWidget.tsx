import { type FC } from 'react';
import { Box, HStack, Popover, PopoverTrigger, PopoverContent, PopoverBody, Text } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import type { EnrichedMeal } from '@/types/app';
import clientConfig from '@/config/client';
import currencyConverter from '@/utils/currencyConverter';
import FormatPrice from '@/components/FormatPrice';

interface DashWidgetProps {
  meal: EnrichedMeal;
  refDate: Date;
}

const DashWidget: FC<DashWidgetProps> = ({ meal, refDate }) => {
  // Cut the history past refDate as if it doesn't exist
  const priceHistory = meal.prices.filter(item => refDate >= new Date(item.date));

  if (priceHistory.length <= 1) {
    return null;
  }

  // Limit to last 10 entries
  const limitedPriceHistory = priceHistory.slice(-10);

  const getColorForPriceChange = (currentAmount: number, previousAmount: number) => {
    if (currentAmount > previousAmount) return 'red.400';
    if (currentAmount < previousAmount) return 'green.400';
    return 'gray.300';
  };

  return (
    <Box>
      <HStack spacing={1}>
        {limitedPriceHistory.map((item, index) => {
          if (index === 0) {
            return null;
          }

          const currentAmount = currencyConverter(item, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE).amount;
          const previousAmount = index > 0 ? currencyConverter(limitedPriceHistory[index - 1], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE).amount : currentAmount;

          if (currentAmount === previousAmount) {
            return null;
          }

          if (currentAmount === previousAmount) {
            return null;
          }

          const color = index === 0 ? 'gray.300' : getColorForPriceChange(currentAmount, previousAmount);
          const timeAgo = formatDistanceToNow(new Date(item.date), { addSuffix: true });
          
          return (
            <Popover key={`${item.date}-${index}`} trigger="hover">
              <PopoverTrigger>
                <Box
                  width="12px"
                  height="4px"
                  bg={color}
                  borderRadius="1px"
                  cursor="pointer"
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  <Text fontSize="sm">
                    <FormatPrice price={limitedPriceHistory[index-1]} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE}/>
                    {' → '}
                    <FormatPrice price={item} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE}/>
                    {' '}
                    <Text fontSize="xs" as="span" color="gray.500">{timeAgo}</Text>
                  </Text>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          );
        })}
      </HStack>
    </Box>
  );
};

export default DashWidget; 