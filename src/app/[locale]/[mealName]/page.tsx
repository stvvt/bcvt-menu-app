import getMeal from '@/backend/getMeal';
import { Badge, Heading, Table, Tbody, Td, Th, Thead, Tr, Card, CardBody, Flex, Box, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { type FC } from 'react';
import MealImage from '@/components/MealImage';
import clientConfig from '@/config/client';
import FormatPrice from '@/components/FormatPrice';
import FormatDate from '@/components/FormatDate';
import getPriceDisplay from '@/i18n/getPriceDisplay';

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
                    <Th padding={0}></Th>
                    <Th paddingLeft={1}>{t('price')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mealData.prices.map((price, index) => {
                    const displayPrice = getPriceDisplay(price, price.date);
                    return (
                      <Tr key={index}>
                        <Td>
                          <FormatDate date={new Date(price.date)} />
                          {price.weight && price.unit && <Text as="span" fontSize="xs" color="gray.500" ml={2}>
                            {price.weight} {price.unit}
                          </Text>}
                        </Td>
                        <Td whiteSpace="nowrap" color={displayPrice?.color} align="right" padding={0}>
                          {displayPrice?.arrow}
                        </Td>
                        <Td whiteSpace="nowrap" color={displayPrice?.color} align="right" paddingLeft={1}>
                          <FormatPrice price={price} currency={NEXT_PUBLIC_BASE_CURRENCY_CODE} showDelta/>
                        </Td>
                        <Td whiteSpace="nowrap">
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