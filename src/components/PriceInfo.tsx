import { type FC } from 'react';
import { HStack, Text, Badge, VStack } from '@chakra-ui/react';
import { differenceInDays } from 'date-fns';
import { useTranslations } from 'next-intl';
import { getMealPriceAt } from '@/utils/mealUtils';
import type { EnrichedMeal } from '@/types/app';
import clientConfig from '@/config/client';
import FormatPrice from '@/components/FormatPrice';
import currencyConverter from '@/utils/currencyConverter';

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
    const currentAmount = currencyConverter(activePriceHistory[activePriceHistory.length - 1], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE).amount;
    const previousAmount = currencyConverter(activePriceHistory[activePriceHistory.length - 2], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE).amount;
    
    if (currentAmount > previousAmount) {
      return {
        arrow: <Text color="red.500" fontSize="sm">↗</Text>,
        color: 'red.500'
      };
    } else if (currentAmount < previousAmount) {
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
      const sortedHistory = priceHistory;
      const refDateIndex = sortedHistory.findIndex(item => item.date === refDateStr);
      
      if (refDateIndex > 0) {
        const currentAmount = currencyConverter(priceAtRefDate, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE).amount;
        const previousAmount = currencyConverter(sortedHistory[refDateIndex - 1], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE).amount;
        
        if (currentAmount !== previousAmount) {
          return {
            text: t('updated'),
            colorScheme: currentAmount > previousAmount ? "red" : "green"
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

  return (
    <VStack align="flex-end" spacing={0}>
      <HStack spacing={1} alignItems="center" position="relative">
        {arrow}
        <Text fontWeight="bold" color={color}>
          <FormatPrice price={price} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE} />
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
        <FormatPrice price={price} currency={clientConfig.NEXT_PUBLIC_SECONDARY_CURRENCY_CODE} />
      </Text>
    </VStack>
  );
};

export default PriceInfo; 