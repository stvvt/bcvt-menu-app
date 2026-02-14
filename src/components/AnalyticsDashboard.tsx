'use client';

import { useMemo, useCallback, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DateRangePicker, { getDefaultDateRange, getDateRangeFromPreset, type DateRange } from '@/components/DateRangePicker';
import { calculateAnalyticsSummary, calculateDailyPriceChanges } from '@/utils/analyticsCalculations';
import CalendarHeatmap from '@/components/CalendarHeatmap';
import type { EnrichedMeal } from '@/types/app';
import { TrendingUp, TrendingDown, Package, BarChart3, CalendarDays } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { convert } from '@/utils/currencyConverter';
import clientConfig from '@/config/client';
import { AnalyticsMealRow, AnalyticsMealList } from '@/components/AnalyticsMealRow';
import FormatCurrencyAmount from '@/components/FormatCurrencyAmount';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { bg } from 'date-fns/locale/bg';
import { it } from 'date-fns/locale/it';
import type { Locale } from 'date-fns';

const dateFnsLocales: Record<string, Locale> = { en: enUS, bg, it };

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
  const locale = useLocale();
  const dfLocale = dateFnsLocales[locale] ?? enUS;
  const [newItemsVisible, setNewItemsVisible] = useState(10);

  const summary = useMemo(() => {
    return calculateAnalyticsSummary(meals, dateRange.from, dateRange.to);
  }, [meals, dateRange]);

  const dailyChanges = useMemo(() => {
    return calculateDailyPriceChanges(meals, dateRange.from, dateRange.to);
  }, [meals, dateRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">{venueName} - {ta('title')}</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 lg:grid-cols-3">
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
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{ta('priceChanges')}</CardTitle>
            <div className="flex gap-1">
              <TrendingUp className="h-4 w-4 text-destructive" />
              <TrendingDown className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-2xl font-bold text-destructive">
                  {summary.itemsWithIncreases}
                </div>
                <p className="text-xs text-muted-foreground">
                  {ta('itemsWithIncreases')}
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {summary.itemsWithDecreases}
                </div>
                <p className="text-xs text-muted-foreground">
                  {ta('itemsWithDecreases')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Change Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {ta('priceChangeActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarHeatmap
            data={dailyChanges}
            from={dateRange.from}
            to={dateRange.to}
          />
        </CardContent>
      </Card>

      {/* Biggest Price Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {ta('biggestChanges')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const allChanges = [...summary.biggestIncreases, ...summary.biggestDecreases]
              .sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange))
              .slice(0, 10);

            if (allChanges.length === 0) {
              return <p className="text-muted-foreground text-sm">{ta('noChanges')}</p>;
            }

            return (
              <AnalyticsMealList>
                {allChanges.map((item) => {
                  const isIncrease = item.priceChange > 0;
                  return (
                    <AnalyticsMealRow
                      key={item.mealName}
                      mealName={item.mealName}
                      localizedName={item.localizedName}
                      category={item.category}
                      venue={venue}
                      icon={
                        isIncrease ? (
                          <TrendingUp className="h-4 w-4 text-destructive flex-shrink-0" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-600 flex-shrink-0" />
                        )
                      }
                      rightContent={
                        <>
                          <p className={`font-bold ${isIncrease ? 'text-destructive' : 'text-green-600'}`}>
                            {isIncrease ? '+' : ''}{item.priceChange.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <FormatCurrencyAmount
                              amount={convert(item.currentPrice, item.currencyCode, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE)}
                              currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE}
                            />
                          </p>
                        </>
                      }
                    />
                  );
                })}
              </AnalyticsMealList>
            );
          })()}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{ta('categoryBreakdown')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Object.entries(summary.categoryBreakdown).map(([category, data]) => (
              <div key={category} className="p-3 rounded-lg border flex justify-between items-start gap-4">
                <div>
                  <p className="font-medium">{t(category)}</p>
                  <p className="text-2xl font-bold">{data.count}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{ta('avg')}</p>
                  <p className="text-2xl font-bold">
                    <FormatCurrencyAmount amount={data.avgPrice} currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE} />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <FormatCurrencyAmount
                      amount={convert(data.avgPrice, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE, clientConfig.NEXT_PUBLIC_SECONDARY_CURRENCY_CODE)}
                      currency={clientConfig.NEXT_PUBLIC_SECONDARY_CURRENCY_CODE}
                    />
                  </p>
                </div>
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
            <AnalyticsMealList>
              {[...summary.newItems]
                .sort((a, b) => {
                  const addedA = [...a.prices].sort((x, y) => x.date.getTime() - y.date.getTime())[0]?.date?.getTime() ?? 0;
                  const addedB = [...b.prices].sort((x, y) => x.date.getTime() - y.date.getTime())[0]?.date?.getTime() ?? 0;
                  return addedB - addedA;
                })
                .slice(0, newItemsVisible)
                .map((item) => {
                const sortedPrices = [...item.prices].sort((a, b) => a.date.getTime() - b.date.getTime());
                const addedDate = sortedPrices[0]?.date;
                const timeAgo = addedDate
                  ? formatDistanceToNow(addedDate, { addSuffix: true, locale: dfLocale })
                  : null;
                return (
                <AnalyticsMealRow
                  key={item.name}
                  mealName={item.name}
                  localizedName={item.info?.name}
                  category={item.category}
                  venue={venue}
                  subtitle={timeAgo}
                  rightContent={
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        <FormatCurrencyAmount
                          amount={convert(item.prices[item.prices.length - 1]?.amount ?? 0, item.prices[0]?.currencyCode, clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE)}
                          currency={clientConfig.NEXT_PUBLIC_BASE_CURRENCY_CODE}
                        />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <FormatCurrencyAmount
                          amount={convert(item.prices[item.prices.length - 1]?.amount ?? 0, item.prices[0]?.currencyCode, clientConfig.NEXT_PUBLIC_SECONDARY_CURRENCY_CODE)}
                          currency={clientConfig.NEXT_PUBLIC_SECONDARY_CURRENCY_CODE}
                        />
                      </p>
                    </div>
                  }
                />
              );
              })}
            </AnalyticsMealList>
            {summary.newItems.length > 10 && newItemsVisible < summary.newItems.length && (
              <div className="mt-3 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewItemsVisible((prev) => prev + 20)}
                >
                  {ta('showMore')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
