'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import PriceSparkline from '@/components/PriceSparkline';
import type { PriceComparison } from '@/types/app';
import { findCheapestVenue, findMostExpensiveVenue } from '@/utils/buildComparison';
import { cn } from '@/lib/utils';

interface VenueComparisonTableProps {
  comparisons: PriceComparison[];
  venueIds: string[];
  venueNames: Record<string, string>;
}

const VenueComparisonTable = ({ 
  comparisons, 
  venueIds,
  venueNames,
}: VenueComparisonTableProps) => {
  if (comparisons.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No common items found across venues to compare.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Item</TableHead>
            {venueIds.map((venueId) => (
              <TableHead key={venueId} className="text-center min-w-[150px]">
                {venueNames[venueId]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisons.map((comparison) => {
            const cheapest = findCheapestVenue(comparison);
            const mostExpensive = findMostExpensiveVenue(comparison);

            return (
              <TableRow key={comparison.mealName}>
                <TableCell className="font-medium">{comparison.mealName}</TableCell>
                {venueIds.map((venueId) => {
                  const venueData = comparison.venues.find(v => v.venueId === venueId);
                  
                  if (!venueData || !venueData.currentPrice) {
                    return (
                      <TableCell key={venueId} className="text-center text-muted-foreground">
                        —
                      </TableCell>
                    );
                  }

                  const isCheapest = cheapest?.venueId === venueId;
                  const isMostExpensive = mostExpensive?.venueId === venueId;

                  return (
                    <TableCell key={venueId} className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn(
                          'font-semibold',
                          isCheapest && 'text-green-600',
                          isMostExpensive && 'text-destructive'
                        )}>
                          {venueData.currentPrice.amount.toFixed(2)} {venueData.currentPrice.currencyCode}
                        </span>
                        {isCheapest && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600">
                            Cheapest
                          </Badge>
                        )}
                        {isMostExpensive && !isCheapest && (
                          <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive">
                            Highest
                          </Badge>
                        )}
                        <PriceSparkline priceHistory={venueData.priceHistory} width={60} height={20} />
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default VenueComparisonTable;
