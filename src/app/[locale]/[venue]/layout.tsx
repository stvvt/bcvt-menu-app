import { getVenueOrThrow, getAllVenueIds } from '@/config/venues';
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
  getVenueOrThrow(venue);

  return <>{children}</>;
};

export default VenueLayout;
