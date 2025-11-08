import { type FC } from 'react';
import Image from 'next/image';
import type { EnrichedMeal } from '@/types/app';

interface MealImageProps {
  meal: EnrichedMeal;
  size?: string;
}

const MealImage: FC<MealImageProps> = ({ meal, size = '72px' }) => {
  return meal.images.length > 0 ? (
    <div className="relative flex-shrink-0 self-stretch" style={{ width: size, minHeight: size }}>
      <Image
        src={meal.images[meal.images.length - 1].imageUrl}
        alt={meal.name}
        fill
        className="object-cover"
      />
    </div>
  ) : (
    <div 
      className="bg-gray-100 flex-shrink-0 self-stretch" 
      style={{ width: size, minHeight: size }}
    />
  );
};

export default MealImage; 