import { getMenu } from '@/backend/getMenu';
import DailyMenu from '@/components/DailyMenu';
import { type FC } from 'react';

const HomeContent: FC<{ 
  searchParams: Promise<{ date: string }>;
  params: Promise<{ locale: string }>;
}> = async ({ searchParams, params }) => {
  const [dateParam, { locale }] = await Promise.all([searchParams, params]);

  const loadingDate = dateParam.date ? new Date(dateParam.date) : new Date();

  return (
    <DailyMenu menuData={getMenu(loadingDate, locale)} refDate={loadingDate} />
  );
}

export default HomeContent;
