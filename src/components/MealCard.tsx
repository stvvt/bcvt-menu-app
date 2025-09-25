import { type FC } from 'react';
import { 
  HStack, 
  Text,
  Card,
  CardBody,
  CardFooter,
  Stack,
} from '@chakra-ui/react';
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
    <Card variant="outline" direction="row">
      <MealImage meal={meal} />
      <Stack flex="1">
        <CardBody p={3} pb={0}>
          <HStack justify="space-between" align="flex-start">
            <Text fontWeight="medium" flex="1">
              {meal.info?.name || meal.name}
              {weight && <>{' '}<Text as="span" fontSize="xs" color="gray.500" whiteSpace="nowrap">
                {weight}
              </Text></>}
            </Text>
            <PriceInfo meal={meal} refDate={refDate} />
          </HStack>
        </CardBody>
        <CardFooter p={3} pt={0} pb={0}>
          <DashWidget meal={meal} refDate={refDate} />
        </CardFooter>
      </Stack>
    </Card>
  );
};

export default MealCard; 