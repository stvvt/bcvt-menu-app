import { getVenue, getAllVenueIds } from '@/config/venues';
import { notFound } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';

type Props = {
  params: Promise<{ venue: string }>;
};

// Generate static params for all known venues
export async function generateStaticParams() {
  return getAllVenueIds().map((venue) => ({ venue }));
}

const VenueLayout: FC<PropsWithChildren<Props>> = async ({ children, params }) => {
  const { venue } = await params;
  
  // Validate venue exists
  const venueConfig = getVenue(venue);
  if (!venueConfig) {
    notFound();
  }

  return <>{children}</>;
};

export default VenueLayout;
