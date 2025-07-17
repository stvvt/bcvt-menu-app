import { type FC } from 'react';
import { 
  HStack, 
  VStack,
  Text,
  Card,
  CardBody,
  Image,
  Box,
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
      <CardBody p={0}>
        <HStack spacing={0} align="stretch">
          {meal.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.name}
              w="80px"
              minH="80px"
              objectFit="cover"
              borderLeftRadius="md"
            />
          ) : (
            <Box w="80px" minW="80px" minH="80px" bg="gray.100" />
          )}
          <VStack flex="1" p={4} align="stretch" spacing={3}>
            <HStack justify="space-between" align="flex-start">
              <Text fontWeight="medium" flex="1">
                {meal.name}
              </Text>
              <PriceInfo meal={meal} refDate={refDate} />
            </HStack>
            <DashWidget meal={meal} refDate={refDate} />
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default MealCard; 