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

interface MealCardProps {
  meal: EnrichedMeal;
  refDate: Date;
}

const MealCard: FC<MealCardProps> = ({ meal, refDate }) => {
  return (
    <Card variant="outline" direction="row">
      <MealImage meal={meal} />
      <Stack flex="1">
        <CardBody p={3} pb={0}>
          <HStack justify="space-between" align="flex-start">
            <Text fontWeight="medium" flex="1">
              {meal.name}
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