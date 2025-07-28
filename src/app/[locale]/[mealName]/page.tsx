import getMeal from '@/backend/getMeal';
import { Badge, Heading, Table, Tbody, Td, Th, Thead, Tr, Card, CardBody, Flex, Box, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { type FC } from 'react';
import MealImage from '@/components/MealImage';
import clientConfig from '@/config/client';
import FormatPrice from '@/components/FormatPrice';
import FormatDate from '@/components/FormatDate';

interface MealPageProps {
  params: Promise<{
    locale: string;
    mealName: string;
  }>;
}

const MealPage: FC<MealPageProps> = async ({ params }) => {
  const { mealName } = await params;
  const { NEXT_PUBLIC_BASE_CURRENCY_CODE, NEXT_PUBLIC_SECONDARY_CURRENCY_CODE } = clientConfig;

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
              <Table w="full" size="sm">
                <Thead>
                  <Tr>
                    <Th w="100%">{t('date')}</Th>
                    <Th colSpan={2} textAlign="center">{t('price')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mealData.prices.map((price) => {
                    return (
                      <Tr key={price.date}>
                        <Td><FormatDate date={new Date(price.date)} /></Td>
                        <Td><FormatPrice price={price} currency={NEXT_PUBLIC_BASE_CURRENCY_CODE} /></Td>
                        <Td>
                          <Text align="right" fontSize="xs" color="gray.500">
                            <FormatPrice price={price} currency={NEXT_PUBLIC_SECONDARY_CURRENCY_CODE} />
                          </Text>
                        </Td>
                      </Tr>
                    )})
                  }
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