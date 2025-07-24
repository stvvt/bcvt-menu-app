import { type FC } from 'react';
import { HStack, Text, Badge, VStack } from '@chakra-ui/react';
import { differenceInDays } from 'date-fns';
import { useFormatter, useTranslations } from 'next-intl';
import { getMealPriceAt } from '@/utils/mealUtils';
import type { EnrichedMeal } from '@/types/app';
import currencyConverter from '@/utils/currencyConverter';
import clientConfig from '@/config/client';

interface PriceInfoProps {
  meal: EnrichedMeal;
  refDate: Date;
}

function getPriceAt(meal: EnrichedMeal, refDate: Date) {
  const { prices:priceHistory } = meal;
  const activePriceHistory = priceHistory.filter(item => refDate >= new Date(item.date));
  return activePriceHistory[activePriceHistory.length - 1];
}

const PriceInfo: FC<PriceInfoProps> = ({ meal, refDate }) => {
  const t = useTranslations();
  const { prices:priceHistory } = meal;
  const format = useFormatter();
  
  const getPriceDisplay = () => {
    const activePriceHistory = priceHistory.filter(item => refDate >= new Date(item.date));
    
    // Rule 1: Need at least 2 elements
    if (!activePriceHistory || activePriceHistory.length < 2) {
      return {
        arrow: null,
        color: 'black'
      };
    }
    
    // Rule 2: Last item older than 3 days
    const lastItem = activePriceHistory[activePriceHistory.length - 1];
    const daysSinceLastPrice = differenceInDays(refDate, new Date(lastItem.date));
    if (daysSinceLastPrice > 3) {
      return {
        arrow: null,
        color: 'black'
      };
    }
    
    // Rule 3: Show corresponding arrow and matching color
    const currentPrice = parseFloat(activePriceHistory[activePriceHistory.length - 1]?.price || '0');
    const previousPrice = parseFloat(activePriceHistory[activePriceHistory.length - 2]?.price || '0');
    
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
            text: t('updated'),
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
  const price = getPriceAt(meal, refDate);

  const priceInBaseCurrency = currencyConverter(price, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE);
  const priceInSecondaryCurrency = currencyConverter(price, clientConfig.NEXT_PUBLIC_SECONDARY_CURRENCY_CODE);

  return (
    <VStack align="flex-end" spacing={0}>
      <HStack spacing={1} alignItems="center" position="relative">
        {arrow}
        <Text fontWeight="bold" color={color}>
          {format.number(priceInBaseCurrency.amount, {style: 'currency', currency: priceInBaseCurrency.currency})}
        </Text>
        <Badge 
          colorScheme={badgeInfo.colorScheme}
          fontSize="3xs"
          minW="16px"
          h="16px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          top="-16px"
          right="-16px"
          px={1}
          py={0}
        >
          {badgeInfo.text}
        </Badge>
      </HStack>
      <Text align="right" fontSize="xs" color={color}>
        {format.number(priceInSecondaryCurrency.amount, {style: 'currency', currency: priceInSecondaryCurrency.currency})}
      </Text>
    </VStack>
  );
};

export default PriceInfo; 