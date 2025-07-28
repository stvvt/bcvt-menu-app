import { type FC } from 'react';
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
import MealCard from './MealCard';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useMenuData } from '@/contexts/MenuDataContext';

type DailyMenuProps = unknown;

const DailyMenu: FC<DailyMenuProps> = () => {
  const { date, menuData, error } = useMenuData();
  const t = useTranslations();

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