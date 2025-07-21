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
import type { EnrichedMeal } from '@/types/app';
import DashWidget from './DashWidget';
import PriceInfo from './PriceInfo';

interface MealCardProps {
  meal: EnrichedMeal;
  refDate: Date;
}

const avatarSize = '72px';

const MealCard: FC<MealCardProps> = ({ meal, refDate }) => {
  return (
    <Card variant="outline" direction="row">
      {meal.images.length > 0 ? (
        <Image
          src={meal.images[meal.images.length - 1].imageUrl}
          alt={meal.name}
          w={avatarSize}
          objectFit="cover"
          borderLeftRadius="md"
        />
      ) : (
        <Box minW={avatarSize} minH={avatarSize} bg="gray.100" borderLeftRadius="md" />
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