// Client-safe venue configuration (no server-only values)

export interface VenueClientConfig {
  id: string;           // URL slug: "bcvt"
  name: string;         // Display name: "BCVT Canteen"
  currency: 'BGN' | 'EUR';  // Default currency
  locale: string;       // Default locale for menu items
}

export const venues: VenueClientConfig[] = [
  {
    id: 'bcvt',
    name: 'BCVT Canteen',
    currency: 'BGN',
    locale: 'bg'
  }
];

export function getVenueClient(venueId: string): VenueClientConfig | undefined {
  return venues.find(v => v.id === venueId);
}

export function getAllVenueIds(): string[] {
  return venues.map(v => v.id);
}
