import { type FC } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { EnrichedMeal } from '@/types/app';
import DashWidget from './DashWidget';
import PriceInfo from './PriceInfo';
import MealImage from './MealImage';
import getMealPrices from '@/utils/getMealPrices';

interface MealCardProps {
  meal: EnrichedMeal;
  refDate: Date;
}

const MealCard: FC<MealCardProps> = ({ meal, refDate }) => {
  const priceHistory = getMealPrices(meal, refDate);
  const recentPrice = priceHistory[priceHistory.length - 1];

  const weight = recentPrice?.weight && recentPrice.unit ? `${recentPrice.weight} ${recentPrice.unit}` : undefined;

  return (
    <Card className="flex flex-row border h-full hover:border-blue-500">
      <MealImage meal={meal} />
      <div className="flex-1 flex flex-col justify-between">
        <CardContent className="px-3 py-1.5 pb-1">
          <div className="flex justify-between items-start">
            <div className="font-medium flex-1">
              {meal.info?.name || meal.name}
              {weight && (
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
                  {weight}
                </span>
              )}
            </div>
            <PriceInfo meal={meal} refDate={refDate} />
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <DashWidget meal={meal} refDate={refDate} />
        </CardFooter>
      </div>
    </Card>
  );
};

export default MealCard; 