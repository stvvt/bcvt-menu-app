import { getAllMeals } from '@/backend/getAllMeals';
import { getVenueOrThrow } from '@/config/venues';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { type FC } from 'react';

interface AnalyticsPageProps {
  params: Promise<{
    locale: string;
    venue: string;
  }>;
}

const AnalyticsPage: FC<AnalyticsPageProps> = async ({ params }) => {
  const { venue, locale } = await params;
  getVenueOrThrow(venue); // validates venue exists
  const meals = await getAllMeals(venue, locale);

  return <AnalyticsDashboard meals={meals} />;
};

export default AnalyticsPage;
