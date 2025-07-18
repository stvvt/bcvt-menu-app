import { type FC } from 'react';
import { 
  HStack, 
  Text,
  Card,
  CardBody,
  Image,
  Box,
  CardFooter,
  Stack,
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
    <Card variant="outline" direction="row">
      {meal.imageUrl ? (
        <Image
          src={meal.imageUrl}
          alt={meal.name}
          w="72px"
          objectFit="cover"
          borderLeftRadius="md"
        />
      ) : (
        <Box minW="72px" minH="72px" bg="gray.100" />
      )}
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