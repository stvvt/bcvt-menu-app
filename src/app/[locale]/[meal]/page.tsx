import getMeal from '@/backend/getMeal';
import { Badge, Heading, Table, Tbody, Td, Th, Thead, Tr, Card, CardBody, Flex, Box } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { type FC } from 'react';
import MealImage from '@/components/MealImage';

interface MealPageProps {
  params: Promise<{
    locale: string;
    meal: string;
  }>;
}

const MealPage: FC<MealPageProps> = async ({ params }) => {
  const { meal: mealName } = await params;

  const mealData = await getMeal(decodeURIComponent(mealName));
  const t = await getTranslations();
  return (
    <>
      <Heading mb={4}>{mealData.name}{' '}<Badge colorScheme="blue">{mealData.category}</Badge></Heading>
      <Card w="full" variant="unstyled">
        <CardBody>
          <Flex>
            <MealImage meal={mealData} size="200px" />
            <Box flex="1" ml={4}>
              <Table w="full">
                <Thead>
                  <Tr>
                    <Th>{t('date')}</Th>
                    <Th>{t('price')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mealData.prices.map((price) => (
                    <Tr key={price.date}>
                      <Td>{price.date}</Td>
                      <Td>{price.price} {price.currency}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default MealPage; 