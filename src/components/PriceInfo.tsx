import { type FC } from 'react';
import { HStack, Text, Badge, VStack } from '@chakra-ui/react';
import { differenceInDays, isSameDay } from 'date-fns';
import { useTranslations } from 'next-intl';
import type { EnrichedMeal } from '@/types/app';
import clientConfig from '@/config/client';
import FormatPrice from '@/components/FormatPrice';
import currencyConverter from '@/utils/currencyConverter';
import getMealPrices from '@/utils/getMealPrices';
import getPriceDisplay from '@/i18n/getPriceDisplay';

interface PriceInfoProps {
  meal: EnrichedMeal;
  refDate: Date;
}

const PriceInfo: FC<PriceInfoProps> = ({ meal, refDate }) => {
  const t = useTranslations();
  const priceHistory = getMealPrices(meal, refDate);
  const recentPrice = priceHistory[priceHistory.length - 1];
  
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
      const currentPrice = priceHistory[refDateIndex];
      const previousPrice = priceHistory[refDateIndex - 1];
      const currentAmount = currencyConverter(currentPrice, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE);
      const previousAmount = currencyConverter(previousPrice, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE);
      const amountChanged = currentAmount !== previousAmount;
      const weightChanged = currentPrice.weight !== previousPrice.weight || currentPrice.unit !== previousPrice.unit;
      
      if (amountChanged || weightChanged) {
        return {
          text: t('updated'),
          colorScheme: amountChanged ? (currentAmount > previousAmount ? "red" : "green") : (weightChanged ? "yellow" : "gray")
        };
      }
    }
    
    const daysSinceLastPrice = differenceInDays(refDate, recentPrice.date);
    
    return {
      text: t('days', {count: daysSinceLastPrice}),
      colorScheme: "gray"
    };
  };

  const { arrow, color } = getPriceDisplay(recentPrice, refDate) ?? { arrow: '', color: 'black' };
  const badgeInfo = getBadgeInfo();

  return (
    <VStack align="flex-end" spacing={0}>
      <HStack spacing={1} alignItems="center" position="relative">
        <Text fontWeight="bold" color={color}>
          {arrow ? <>{arrow}{' '}</> : undefined} 
          <FormatPrice price={recentPrice} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE} showDelta/>
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