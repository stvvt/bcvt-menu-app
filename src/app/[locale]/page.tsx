import { venues } from '@/config/venues.client';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, UtensilsCrossed, TrendingUp } from 'lucide-react';
import { redirect } from '@/i18n/navigation';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // If only one venue, redirect directly to it
  if (venues.length === 1) {
    redirect({ href: `/${venues[0].id}`, locale });
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Price Tracker</h1>
        <p className="text-muted-foreground">
          Track menu prices and analyze price changes across venues
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <Link key={venue.id} href={`/${venue.id}`}>
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {venue.name}
                </CardTitle>
                <CardDescription>
                  Default currency: {venue.currency}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <UtensilsCrossed className="h-4 w-4" />
                    Daily Menu
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Analytics
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
