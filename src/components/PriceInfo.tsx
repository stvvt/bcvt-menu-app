import { type FC } from 'react';
import { Badge } from '@/components/ui/badge';
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

  const daysSinceLastPrice = differenceInDays(refDate, recentPrice.date);

  const getBadgeInfo = () => {
    if (!priceHistory || priceHistory.length === 0) {
      return {
        text: "0",
        type: "default" as const
      };
    }
    
    // First appearance of this meal on refDate
    if (priceHistory.length === 1) {
      if (isSameDay(priceHistory[0].date, refDate)) {
        return {
          text: t('new'),
          type: "new" as const
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
          type: amountChanged ? "amountChanged" as const : "weightChanged" as const
        };
      }
    }
    
    return {
      text: t('days', {count: daysSinceLastPrice}),
      type: "default" as const
    };
  };

  const { color } = getPriceDisplay(recentPrice, refDate) ?? { color: 'black' };
  const badgeInfo = getBadgeInfo();

  const getBadgeClasses = (type: string) => {
    const baseClasses = "text-[10px] leading-none min-w-4 h-4 flex items-center justify-center absolute -top-3.5 -right-4 px-1 py-0 font-medium rounded-full";
    
    switch (type) {
      case "new":
        return `${baseClasses} bg-green-500 text-white`;
      case "weightChanged":
        return `${baseClasses} bg-yellow-500 text-black`;
      case "amountChanged":
        return `${baseClasses} bg-red-500 text-white`;
      default:
        return `${baseClasses} bg-gray-400 text-white`;
    }
  };

  return (
    <div className="flex flex-col items-end gap-0">
      <div className="flex items-center gap-1 relative">
        <div className="font-bold" style={{ color }}>
          <FormatPrice price={recentPrice} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE} showDelta={daysSinceLastPrice < 3}/>
        </div>
        <Badge className={getBadgeClasses(badgeInfo.type)}>
          {badgeInfo.text}
        </Badge>
      </div>
      <div className="text-right text-xs" style={{ color }}>
        <FormatPrice price={recentPrice} currency={clientConfig.NEXT_PUBLIC_SECONDARY_CURRENCY_CODE} />
      </div>
    </div>
  );
};

export default PriceInfo; 