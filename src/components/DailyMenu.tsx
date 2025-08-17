import { type FC } from 'react';
import { 
  Box, 
  Grid, 
  Text, 
  VStack, 
  Heading,
} from '@chakra-ui/react';
import MealCard from './MealCard';
import { Link } from '@/i18n/navigation';
import type { MealGroup } from '@/backend/getMenu';
import { getTranslations } from 'next-intl/server';

type DailyMenuProps = {
  menuData: Promise<MealGroup[]>;
  refDate: Date;
};

const DailyMenu: FC<DailyMenuProps> = async ({ menuData, refDate }) => {
  const t = await getTranslations();

  const groups = await menuData;

  if (groups.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No meals available for this date.</Text>
      </Box>
    );
  }

  return (
    <Box>
        {groups.map((group) => (
          <VStack key={group.category} pb={16}>
            <Heading size="sm" textAlign="center" background="blue.300" color="whiteAlpha.1000" mb={4} p={2} borderRadius="md">{t(group.category?.toLowerCase() ?? '')?.toUpperCase()}</Heading>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={4}
              w="100%"
            >
              {group.meals.map((meal, index) => (
                <Link key={index} href={`/${meal.name}`}>
                  <Box 
                    cursor="pointer" 
                    _hover={{ 
                      '> div': { borderColor: 'blue.500' }
                    }} 
                    transition="all 0.2s"
                  >
                    <MealCard meal={meal} refDate={refDate} />
                  </Box>
                </Link>
              ))}
            </Grid>
          </VStack>
        ))}
    </Box>
  );
};

export default DailyMenu;