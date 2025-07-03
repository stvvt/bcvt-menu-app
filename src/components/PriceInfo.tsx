import { type FC } from 'react';
import { HStack, Text, IconButton, Popover, PopoverTrigger, PopoverContent, PopoverBody } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { differenceInDays } from 'date-fns';
import { Meal } from '@/types/Meal';

interface PriceInfoProps {
  meal: Meal;
}

const PriceInfo: FC<PriceInfoProps> = ({ meal }) => {
  const getPriceDisplay = () => {
    const { priceHistory } = meal;
    
    // Rule 1: Need at least 2 elements
    if (!priceHistory || priceHistory.length < 2) {
      return {
        arrow: null,
        color: 'black'
      };
    }
    
    // Rule 2: Last item older than 3 days
    const lastItem = priceHistory[priceHistory.length - 1];
    const daysSinceLastPrice = differenceInDays(new Date(), new Date(lastItem.date));
    if (daysSinceLastPrice > 3) {
      return {
        arrow: null,
        color: 'black'
      };
    }
    
    // Rule 3: Show corresponding arrow and matching color
    const currentPrice = parseFloat(priceHistory[priceHistory.length - 1]?.price || '0');
    const previousPrice = parseFloat(priceHistory[priceHistory.length - 2]?.price || '0');
    
    if (currentPrice > previousPrice) {
      return {
        arrow: <Text color="red.500" fontSize="sm">↗</Text>,
        color: 'red.500'
      };
    } else if (currentPrice < previousPrice) {
      return {
        arrow: <Text color="green.500" fontSize="sm">↘</Text>,
        color: 'green.500'
      };
    }
    
    return {
      arrow: null,
      color: undefined
    };
  };

  const getDaysSinceLastPrice = () => {
    const { priceHistory } = meal;
    if (!priceHistory || priceHistory.length === 0) return 0;
    
    const lastItem = priceHistory[priceHistory.length - 1];
    return differenceInDays(new Date(), new Date(lastItem.date));
  };

  const { arrow, color } = getPriceDisplay();
  const daysSince = getDaysSinceLastPrice();

  return (
    <HStack spacing={0.5} flexShrink={0} alignItems="top">
      <HStack spacing={1} alignItems="center">
        {arrow}
        <Text fontWeight="bold" color={color}>
          {meal.price} {meal.currency || 'лв'}
        </Text>
      </HStack>
      <Popover>
        <PopoverTrigger>
          <IconButton
            aria-label="Price information"
            icon={<InfoIcon color="gray.500" />}
            size="xs"
            variant="ghost"
            colorScheme="gray"
          />
        </PopoverTrigger>
        <PopoverContent width="auto">
          <PopoverBody>
            <Text fontSize="xs">since {daysSince === 0 ? 'today' : `${daysSince} days ago`}</Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </HStack>
  );
};

export default PriceInfo; 