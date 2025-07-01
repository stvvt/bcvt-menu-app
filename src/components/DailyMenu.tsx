import { useState, useEffect } from 'react';
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
  CardBody
} from '@chakra-ui/react';
import { getMenu } from '@/backend/getMenu';

interface Meal {
  name: string;
  price: string;
  currency?: string;
}

interface MenuData {
  date: string;
  meals: Meal[];
}

interface DailyMenuProps {
  date: Date;
}

export default function DailyMenu({ date }: DailyMenuProps) {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
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
        if (isMounted) {
          setError('Failed to load menu data');
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

  const meals = menuData?.meals || [];

  if (meals.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No meals available for this date.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={4}
        w="100%"
      >
        {meals.map((meal, index) => (
          <Card key={index} variant="outline">
            <CardBody>
              <HStack justify="space-between" align="flex-start">
                <Text fontWeight="medium" flex="1">
                  {meal.name}
                </Text>
                <Text fontWeight="bold" color="green.600" flexShrink={0}>
                  {meal.price} {meal.currency || 'лв'}
                </Text>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Box>
  );
} 