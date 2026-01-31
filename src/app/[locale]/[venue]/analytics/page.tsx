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
  const venueConfig = getVenueOrThrow(venue);
  const meals = await getAllMeals(venue, locale);

  return <AnalyticsDashboard meals={meals} venueName={venueConfig.name} />;
};

export default AnalyticsPage;
