import { type FC } from 'react';
import { HStack, Text, Badge } from '@chakra-ui/react';
import { differenceInDays } from 'date-fns';
import { useTranslations } from 'next-intl';
import { Meal } from '@/types/Meal';
import { getMealPriceAt } from '@/utils/mealUtils';

interface PriceInfoProps {
  meal: Meal;
  refDate: Date;
}

const PriceInfo: FC<PriceInfoProps> = ({ meal, refDate }) => {
  const t = useTranslations();
  
  const getPriceDisplay = () => {
    const { priceHistory: priceHistoryProp } = meal;

    const priceHistory = priceHistoryProp.filter(item => refDate >= new Date(item.date));
    
    // Rule 1: Need at least 2 elements
    if (!priceHistory || priceHistory.length < 2) {
      return {
        arrow: null,
        color: 'black'
      };
    }
    
    // Rule 2: Last item older than 3 days
    const lastItem = priceHistory[priceHistory.length - 1];
    const daysSinceLastPrice = differenceInDays(refDate, new Date(lastItem.date));
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

  const getBadgeInfo = () => {
    const { priceHistory } = meal;
    if (!priceHistory || priceHistory.length === 0) {
      return {
        text: "0",
        colorScheme: "gray"
      };
    }
    
    // First appearance of this meal on refDate
    if (priceHistory.length === 1) {
      const refDateStr = refDate.toISOString().split('T')[0];
      if (priceHistory[0].date === refDateStr) {
        return {
          text: t('new'),
          colorScheme: "green"
        };
      }
    }
    
    // Check if price changed at refDate
    const refDateStr = refDate.toISOString().split('T')[0];
    const priceAtRefDate = getMealPriceAt(meal, refDate);
    
    if (priceAtRefDate) {
      // Find the previous price entry
      const sortedHistory = [...priceHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const refDateIndex = sortedHistory.findIndex(item => item.date === refDateStr);
      
      if (refDateIndex > 0) {
        const currentPrice = parseFloat(priceAtRefDate.price);
        const previousPrice = parseFloat(sortedHistory[refDateIndex - 1].price);
        
        if (currentPrice !== previousPrice) {
          return {
            text: "updated",
            colorScheme: currentPrice > previousPrice ? "red" : "green"
          };
        }
      }
    }
    
    // Otherwise - show days since last price change
    const lastItem = priceHistory[priceHistory.length - 1];
    const daysSinceLastPrice = differenceInDays(refDate, new Date(lastItem.date));
    
    return {
      text: t('days', {count: daysSinceLastPrice}),
      colorScheme: "gray"
    };
  };

  const { arrow, color } = getPriceDisplay();
  const badgeInfo = getBadgeInfo();

  return (
    <HStack spacing={0.5} flexShrink={0} alignItems="top">
      <HStack spacing={1} alignItems="center" position="relative">
        {arrow}
        <Text fontWeight="bold" color={color}>
          {meal.price} {meal.currency || 'лв'}
        </Text>
        <Badge 
          colorScheme={badgeInfo.colorScheme}
          fontSize="2xs"
          borderRadius="0"
          borderTopRightRadius="5px"
          minW="16px"
          h="16px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          top="-20px"
          right="-20px"
          px={1}
          py={0}
        >
          {badgeInfo.text}
        </Badge>
      </HStack>
    </HStack>
  );
};

export default PriceInfo; 