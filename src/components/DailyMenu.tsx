import { useState, useEffect, type FC } from 'react';
import { 
  Box, 
  Grid, 
  Text, 
  VStack, 
  Spinner, 
  Alert, 
  AlertIcon,
  Heading,
} from '@chakra-ui/react';
import { getMenu } from '@/backend/getMenu';
import MealCard from './MealCard';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { EnrichedMeal } from '@/types/app';

type MealGroup = {
  category?: string;
  meals: EnrichedMeal[];
};
interface DailyMenuProps {
  date: Date;
}

const DailyMenu: FC<DailyMenuProps> = ({ date: dateProp }) => {
  const [menuData, setMenuData] = useState<MealGroup[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const t = useTranslations();

  useEffect(() => {
    async function fetchMenu() {
      try {
        setError(null);
        const data = await getMenu(dateProp);
        setMenuData(data);
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }
        setError(`Failed to load menu data ${err.message}`);
        setMenuData(null);
      } finally {
        setDate(dateProp);
      }
    }

    fetchMenu();
  }, [dateProp]);

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!date || !menuData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <VStack spacing={4}>
          <Spinner size="lg" />
          <Text>Loading menu data...</Text>
        </VStack>
      </Box>
    );
  }

  const groups = menuData || [];

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
                    <MealCard meal={meal} refDate={date} />
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