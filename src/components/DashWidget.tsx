import { type FC } from 'react';
import { Box, HStack, Popover, PopoverTrigger, PopoverContent, PopoverBody, Text } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { Meal } from '@/types/Meal';

interface DashWidgetProps {
  meal: Meal;
  refDate: Date;
}

const DashWidget: FC<DashWidgetProps> = ({ meal, refDate }) => {
  // Cut the history past refDate as if it doesn't exist
  const priceHistory = meal.priceHistory.filter(item => refDate >= new Date(item.date));

  if (!priceHistory || priceHistory.length <= 1) {
    return null;
  }

  // Limit to last 10 entries
  const limitedPriceHistory = priceHistory.slice(-10);

  const getColorForPriceChange = (currentPrice: number, previousPrice: number) => {
    if (currentPrice > previousPrice) return 'red.400';
    if (currentPrice < previousPrice) return 'green.400';
    return 'gray.300';
  };

  return (
    <Box mt={2}>
      <HStack spacing={1}>
        {limitedPriceHistory.map((item, index) => {
          if (index === 0) {
            return null;
          }

          const currentPrice = parseFloat(item.price || '0');
          const previousPrice = index > 0 ? parseFloat(limitedPriceHistory[index - 1]?.price || '0') : currentPrice;
          const color = index === 0 ? 'gray.300' : getColorForPriceChange(currentPrice, previousPrice);
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
                    {limitedPriceHistory[index-1].price} {limitedPriceHistory[index-1].currency || 'лв'} → {item.price} {item.currency || 'лв'}{' '} 
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