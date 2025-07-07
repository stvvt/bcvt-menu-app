import { type FC } from 'react';
import { 
  HStack, 
  Text,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { Meal } from '@/types/Meal';
import DashWidget from './DashWidget';
import PriceInfo from './PriceInfo';

interface MealCardProps {
  meal: Meal;
  refDate: Date;
}

const MealCard: FC<MealCardProps> = ({ meal, refDate }) => {
  return (
    <Card variant="outline">
      <CardBody>
        <HStack justify="space-between" align="flex-start">
          <Text fontWeight="medium" flex="1">
            {meal.name}
          </Text>
          <PriceInfo meal={meal} refDate={refDate} />
        </HStack>
        <DashWidget meal={meal} refDate={refDate} />
      </CardBody>
    </Card>
  );
};

export default MealCard; 