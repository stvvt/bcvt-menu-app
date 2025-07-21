import getMeal from '@/backend/getMeal';
import { Badge, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { type FC } from 'react';

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
      <Heading>{mealData.name}{' '}<Badge colorScheme="blue">{mealData.category}</Badge></Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>{t('date')}</Th>
            <Th>{t('price')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {mealData.priceHistory.map((price) => (
            <Tr key={price.date}>
              <Td>{price.date}</Td>
              <Td>{price.price} {price.currency}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default MealPage; 