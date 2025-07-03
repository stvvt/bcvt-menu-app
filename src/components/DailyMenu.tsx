import { useState, useEffect, type FC } from 'react';
import { 
  Box, 
  Grid, 
  Text, 
  VStack, 
  HStack, 
  Spinner, 
  Alert, 
  AlertIcon,
  Card,
  CardBody,
  Heading,
} from '@chakra-ui/react';
import { getMenu } from '@/backend/getMenu';
import { MealGroup } from '@/types/Meal';
import DashWidget from './DashWidget';
import PriceInfo from './PriceInfo';

interface DailyMenuProps {
  date: Date;
}

const DailyMenu: FC<DailyMenuProps> = ({ date }) => {
  const [menuData, setMenuData] = useState<MealGroup[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchMenu() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMenu(date);
        if (isMounted) {
          setMenuData(data);
        }
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }
        if (isMounted) {
          setError(`Failed to load menu data ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMenu();

    return () => {
      isMounted = false;
    };
  }, [date]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <VStack spacing={4}>
          <Spinner size="lg" />
          <Text>Loading menu data...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
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
            <Heading size="md" textAlign="center" background="blue.500" color="white" mb={4} p={2} borderRadius="md">{group.category?.toUpperCase()}</Heading>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={4}
              w="100%"
            >
              {group.meals.map((meal, index) => (
                <Card key={index} variant="outline">
                  <CardBody>
                    <HStack justify="space-between" align="flex-start">
                      <Text fontWeight="medium" flex="1">
                        {meal.name}
                      </Text>
                      <PriceInfo meal={meal} />
                    </HStack>
                    <DashWidget priceHistory={meal.priceHistory} />
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </VStack>
        ))}
    </Box>
  );
};

export default DailyMenu;