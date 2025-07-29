import { type FC } from 'react';
import { HStack, Text, Badge, VStack } from '@chakra-ui/react';
import { differenceInDays, isSameDay } from 'date-fns';
import { useTranslations } from 'next-intl';
import type { EnrichedMeal } from '@/types/app';
import clientConfig from '@/config/client';
import FormatPrice from '@/components/FormatPrice';
import currencyConverter from '@/utils/currencyConverter';
import getMealPrices from '@/utils/getMealPrices';

interface PriceInfoProps {
  meal: EnrichedMeal;
  refDate: Date;
}

const PriceInfo: FC<PriceInfoProps> = ({ meal, refDate }) => {
  const t = useTranslations();
  const priceHistory = getMealPrices(meal, refDate);
  const recentPrice = priceHistory[priceHistory.length - 1];
  
  const getPriceDisplay = () => {
    // Rule 1: Need at least 2 elements
    if (priceHistory.length < 2) {
      return {
        arrow: null,
        color: 'black.500'
      };
    }
    
    // Rule 2: Last item older than 3 days
    const daysSinceLastPrice = differenceInDays(refDate, new Date(recentPrice.date));
    if (daysSinceLastPrice > 3) {
      return {
        arrow: null,
        color: 'black.500'
      };
    }
    
    // Rule 3: Show corresponding arrow and matching color
    const currentAmount = currencyConverter(priceHistory[priceHistory.length - 1], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE);
    const previousAmount = currencyConverter(priceHistory[priceHistory.length - 2], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE);
    
    if (currentAmount > previousAmount) {
      return {
        arrow: '↗',
        color: 'red.500'
      };
    } else if (currentAmount < previousAmount) {
      return {
        arrow: '↘',
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
      if (isSameDay(priceHistory[0].date, refDate)) {
        return {
          text: t('new'),
          colorScheme: "green"
        };
      }
    }
    
    const refDateIndex = priceHistory.findIndex(item => isSameDay(item.date, refDate));
    
    if (refDateIndex > 0) {
      const currentAmount = currencyConverter(priceHistory[refDateIndex], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE);
      const previousAmount = currencyConverter(priceHistory[refDateIndex - 1], clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE);
      
      if (currentAmount !== previousAmount) {
        return {
          text: t('updated'),
          colorScheme: currentAmount > previousAmount ? "red" : "green"
        };
      }
    }
    
    const daysSinceLastPrice = differenceInDays(refDate, recentPrice.date);
    
    return {
      text: t('days', {count: daysSinceLastPrice}),
      colorScheme: "gray"
    };
  };

  const { arrow, color } = getPriceDisplay();
  const badgeInfo = getBadgeInfo();

  return (
    <VStack align="flex-end" spacing={0}>
      <HStack spacing={1} alignItems="center" position="relative">
        <Text fontWeight="bold" color={color}>
          {arrow}{' '}
          <FormatPrice price={recentPrice} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE} />
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
        <FormatPrice price={recentPrice} currency={clientConfig.NEXT_PUBLIC_SECONDARY_CURRENCY_CODE} />
      </Text>
    </VStack>
  );
};

export default PriceInfo; 