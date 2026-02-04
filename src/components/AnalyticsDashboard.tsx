'use client';

import { useMemo, useCallback } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useRouter, usePathname, Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DateRangePicker, { getDefaultDateRange, getDateRangeFromPreset, type DateRange } from '@/components/DateRangePicker';
import { calculateAnalyticsSummary } from '@/utils/analyticsCalculations';
import type { EnrichedMeal } from '@/types/app';
import { TrendingUp, TrendingDown, Package, BarChart3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { convert } from '@/utils/currencyConverter';
import clientConfig from '@/config/client';

interface AnalyticsDashboardProps {
  meals: EnrichedMeal[];
  venueName: string;
}

const AnalyticsDashboard = ({ meals, venueName }: AnalyticsDashboardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const venue = params.venue as string;

  // Read period from URL, fallback to default
  const dateRange = useMemo(() => {
    const periodParam = searchParams.get('period');
    return getDateRangeFromPreset(periodParam) ?? getDefaultDateRange();
  }, [searchParams]);

  // Update URL when period changes
  const setDateRange = useCallback((range: DateRange) => {
    const params = new URLSearchParams(searchParams);
    params.set('period', range.labelKey);
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const t = useTranslations();
  const ta = useTranslations('analytics');

  const summary = useMemo(() => {
    return calculateAnalyticsSummary(meals, dateRange.from, dateRange.to);
  }, [meals, dateRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">{venueName} - {ta('title')}</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{ta('totalItems')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalMeals}
              {summary.newItems.length > 0 && (
                <span className="text-base font-normal text-muted-foreground ml-2">
                  ({t('newCount', { count: summary.newItems.length })})
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {ta('trackedInPeriod')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{ta('avgPriceChange')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className={`text-2xl font-bold ${summary.avgPriceChange > 0 ? 'text-destructive' : summary.avgPriceChange < 0 ? 'text-green-600' : ''}`}>
                {summary.avgPriceChange > 0 ? '+' : ''}{summary.avgPriceChange.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {ta('acrossAllItems')}
              </p>
            </div>
            <div>
              <div className={`text-2xl font-bold ${summary.avgPriceChangeComparable > 0 ? 'text-destructive' : summary.avgPriceChangeComparable < 0 ? 'text-green-600' : ''}`}>
                {summary.avgPriceChangeComparable > 0 ? '+' : ''}{summary.avgPriceChangeComparable.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {ta('excludingNewListings')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{ta('priceIncreases')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {summary.itemsWithIncreases}
            </div>
            <p className="text-xs text-muted-foreground">
              {ta('itemsWithIncreases')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{ta('priceDecreases')}</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary.itemsWithDecreases}
            </div>
            <p className="text-xs text-muted-foreground">
              {ta('itemsWithDecreases')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Biggest Movers */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Biggest Increases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-destructive" />
              {ta('biggestIncreases')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary.biggestIncreases.length > 0 ? (
              <div className="space-y-3">
                {summary.biggestIncreases.map((item) => (
                  <Link
                    key={item.mealName}
                    href={`/${venue}/${item.mealName}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.localizedName || item.mealName}</p>
                      <Badge variant="outline" className="text-xs">{t(item.category)}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-destructive">+{item.priceChange.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">{convert(item.currentPrice, item.currencyCode, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE).toFixed(2)} {clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{ta('noIncreases')}</p>
            )}
          </CardContent>
        </Card>

        {/* Biggest Decreases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              {ta('biggestDecreases')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary.biggestDecreases.length > 0 ? (
              <div className="space-y-3">
                {summary.biggestDecreases.map((item) => (
                  <Link
                    key={item.mealName}
                    href={`/${venue}/${item.mealName}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.localizedName || item.mealName}</p>
                      <Badge variant="outline" className="text-xs">{t(item.category)}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{item.priceChange.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">{convert(item.currentPrice, item.currencyCode, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE).toFixed(2)} {clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{ta('noDecreases')}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{ta('categoryBreakdown')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(summary.categoryBreakdown).map(([category, data]) => (
              <div key={category} className="p-3 rounded-lg border">
                <p className="font-medium">{t(category)}</p>
                <p className="text-2xl font-bold">{data.count}</p>
                <p className="text-xs text-muted-foreground">
                  {ta('avg')}: {data.avgPrice.toFixed(2)} {clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Items */}
      {summary.newItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {ta('newItems')}
              <Badge variant="secondary">{summary.newItems.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.newItems.map((item) => (
                <Link
                  key={item.name}
                  href={`/${venue}/${item.name}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                >
                  <div>
                    <p className="font-medium text-sm">{item.info?.name || item.name}</p>
                    <Badge variant="outline" className="text-xs">{t(item.category)}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {convert(item.prices[item.prices.length - 1]?.amount ?? 0, item.prices[0]?.currencyCode, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE).toFixed(2)} {clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
