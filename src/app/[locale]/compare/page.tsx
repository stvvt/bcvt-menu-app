import { getAllMeals } from '@/backend/getAllMeals';
import { venues } from '@/config/venues';
import { venues as clientVenues } from '@/config/venues.client';
import VenueComparisonTable from '@/components/VenueComparisonTable';
import { buildPriceComparison, type VenueMealsData } from '@/utils/buildComparison';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { type FC } from 'react';

interface ComparePageProps {
  params: Promise<{
    locale: string;
  }>;
}

const ComparePage: FC<ComparePageProps> = async ({ params }) => {
  const { locale } = await params;

  // If only one venue, show a message
  if (venues.length < 2) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Price Comparison</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              Not Enough Venues
            </CardTitle>
            <CardDescription>
              Price comparison requires at least 2 venues to compare.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Currently, there is only one venue configured. Add more venues to enable cross-venue price comparisons.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch meals from all venues
  const venueData: VenueMealsData[] = await Promise.all(
    clientVenues.map(async (venue) => ({
      venue,
      meals: await getAllMeals(venue.id, locale),
    }))
  );

  // Build comparison data
  const comparisons = buildPriceComparison(venueData);

  // Build venue names map
  const venueNames: Record<string, string> = {};
  for (const venue of clientVenues) {
    venueNames[venue.id] = venue.name;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Price Comparison</h1>
        <p className="text-muted-foreground">
          Compare prices for the same items across different venues
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Venues Compared</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{venues.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Common Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comparisons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {venueData.reduce((sum, v) => sum + v.meals.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <VenueComparisonTable
        comparisons={comparisons}
        venueIds={clientVenues.map(v => v.id)}
        venueNames={venueNames}
      />
    </div>
  );
};

export default ComparePage;
