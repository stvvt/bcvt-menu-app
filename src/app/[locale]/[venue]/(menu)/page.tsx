import { getMenu } from '@/backend/getMenu';
import DailyMenu from '@/components/DailyMenu';
import PriceSurprises from '@/components/PriceSurprises';
import { type FC } from 'react';

const HomeContent: FC<{ 
  searchParams: Promise<{ date: string }>;
  params: Promise<{ locale: string; venue: string }>;
}> = async ({ searchParams, params }) => {
  const [dateParam, { locale, venue }] = await Promise.all([searchParams, params]);

  const loadingDate = dateParam.date ? new Date(dateParam.date) : new Date();

  const menuData = await getMenu(venue, loadingDate, locale);

  return (
    <>
      <PriceSurprises menuData={menuData} refDate={loadingDate} />
      <DailyMenu menuData={Promise.resolve(menuData)} refDate={loadingDate} />
    </>
  );
}

export default HomeContent;
