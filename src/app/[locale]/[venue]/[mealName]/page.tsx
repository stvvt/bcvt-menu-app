import getMeal from '@/backend/getMeal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTranslations } from 'next-intl/server';
import { type FC } from 'react';
import MealImage from '@/components/MealImage';
import clientConfig from '@/config/client';
import FormatPrice from '@/components/FormatPrice';
import FormatDate from '@/components/FormatDate';
import getPriceDisplay from '@/i18n/getPriceDisplay';

interface MealPageProps {
  params: Promise<{
    locale: string;
    venue: string;
    mealName: string;
  }>;
}

const MealPage: FC<MealPageProps> = async ({ params }) => {
  const { mealName, locale, venue } = await params;
  const { NEXT_PUBLIC_BASE_CURRENCY_CODE, NEXT_PUBLIC_SECONDARY_CURRENCY_CODE } = clientConfig;

  const mealData = await getMeal(venue, decodeURIComponent(mealName), locale);
  const t = await getTranslations();
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">
        {mealData.info?.name}
        {' '}
        <Badge variant="default" className="align-middle whitespace-nowrap">{t(mealData.category)}</Badge>
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="rounded-lg overflow-hidden w-full sm:w-56 sm:shrink-0 aspect-square sm:aspect-auto sm:h-56">
          <MealImage meal={mealData} size="100%" />
        </div>
        <div className="min-w-0 flex-1 flex flex-col gap-2">
          {mealData.info?.description && (
            <p className="text-muted-foreground leading-relaxed">
              {mealData.info.description}
            </p>
          )}
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t('analytics.priceHistory')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-full">{t('date')}</TableHead>
                    <TableHead className="text-right">{t('price')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mealData.prices.map((price, index) => {
                    const displayPrice = getPriceDisplay(price, price.date);
                    return (
                      <TableRow key={index}>
                        <TableCell className="align-top">
                          <FormatDate date={new Date(price.date)} />
                          {price.weight && price.unit && (
                            <span className="text-xs text-muted-foreground ml-2">
                              {price.weight} {price.unit}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right align-top">
                          <div className="flex flex-col items-end gap-0.5">
                            <span>
                              <FormatPrice
                                price={price}
                                currency={NEXT_PUBLIC_BASE_CURRENCY_CODE}
                                showDelta
                                deltaClassName={displayPrice?.colorClass ? `text-xs font-normal ${displayPrice.colorClass}` : undefined}
                              />
                            </span>
                            <span className="text-xs text-muted-foreground">
                              <FormatPrice price={price} currency={NEXT_PUBLIC_SECONDARY_CURRENCY_CODE} />
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )})
                  }
                </TableBody>
              </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default MealPage;
