import { type FC } from 'react';
import { Image, Box } from '@chakra-ui/react';
import type { EnrichedMeal } from '@/types/app';

interface MealImageProps {
  meal: EnrichedMeal;
  size?: string;
}

const MealImage: FC<MealImageProps> = ({ meal, size = '72px' }) => {
  return meal.images.length > 0 ? (
    <Image
      src={meal.images[meal.images.length - 1].imageUrl}
      alt={meal.name}
      w={size}
      objectFit="cover"
      borderLeftRadius="md"
    />
  ) : (
    <Box minW={size} minH={size} bg="gray.100" borderLeftRadius="md" />
  );
};

export default MealImage; 