import getMeal from '@/backend/getMeal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTranslations } from 'next-intl/server';
import { type FC } from 'react';
import MealImage from '@/components/MealImage';
import clientConfig from '@/config/client';
import FormatPrice from '@/components/FormatPrice';
import FormatDate from '@/components/FormatDate';
import getPriceDisplay from '@/i18n/getPriceDisplay';
import { cn } from '@/lib/utils';

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
      <h1 className="text-3xl font-bold flex items-center gap-2">
        {mealData.info?.name}
        <Badge variant="default">{t(mealData.category)}</Badge>
      </h1>
      {mealData.info?.description && (
        <p className="text-muted-foreground leading-relaxed">
          {mealData.info.description}
        </p>
      )}
      <Card className="w-full">
        <CardContent className="p-0">
          <div className="flex">
            <MealImage meal={mealData} size="200px" />
            <div className="flex-1 p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-full">{t('date')}</TableHead>
                    <TableHead className="text-center" colSpan={3} align="center">{t('price')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mealData.prices.map((price, index) => {
                    const displayPrice = getPriceDisplay(price, price.date);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <FormatDate date={new Date(price.date)} />
                          {price.weight && price.unit && (
                            <span className="text-xs text-muted-foreground ml-2">
                              {price.weight} {price.unit}
                            </span>
                          )}
                        </TableCell>
                        <TableCell 
                          className={cn("whitespace-nowrap text-right", displayPrice?.colorClass)}
                        >
                          <FormatPrice price={price} currency={NEXT_PUBLIC_BASE_CURRENCY_CODE} showDelta/>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-right text-xs text-muted-foreground">
                            <FormatPrice price={price} currency={NEXT_PUBLIC_SECONDARY_CURRENCY_CODE} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )})
                  }
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default MealPage;
