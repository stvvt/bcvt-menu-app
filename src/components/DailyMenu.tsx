import { type FC } from 'react';
// No UI imports needed - using Tailwind classes
import MealCard from './MealCard';
import { Link } from '@/i18n/navigation';
import type { MealGroup } from '@/backend/getMenu';
import { getTranslations } from 'next-intl/server';

type DailyMenuProps = {
  menuData: Promise<MealGroup[]>;
  refDate: Date;
};

const DailyMenu: FC<DailyMenuProps> = async ({ menuData, refDate }) => {
  const t = await getTranslations();

  const groups = await menuData;

  if (groups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No meals available for this date.</p>
      </div>
    );
  }

  return (
    <div>
        {groups.map((group) => (
          <div key={group.category} className="pb-16 flex flex-col items-center gap-4">
            <h2 className="text-sm font-semibold text-center bg-blue-300 text-white mb-4 p-2 rounded-md">
              {t(group.category?.toLowerCase() ?? '')?.toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-stretch">
              {group.meals.map((meal, index) => (
                <Link key={index} href={`/${meal.name}`} className="h-full">
                    <MealCard meal={meal} refDate={refDate} />
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default DailyMenu;