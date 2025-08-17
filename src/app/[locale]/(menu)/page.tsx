import { getMenu } from '@/backend/getMenu';
import DailyMenu from '@/components/DailyMenu';
import { type FC } from 'react';

const HomeContent: FC<{ searchParams: Promise<{ date: string }> }> = async ({ searchParams }) => {
  const dateParam = await searchParams;

  const loadingDate = dateParam.date ? new Date(dateParam.date) : new Date();

  return (
    <DailyMenu menuData={getMenu(loadingDate)} refDate={loadingDate} />
  );
}

export default HomeContent;
