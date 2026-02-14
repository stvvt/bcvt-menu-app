'use client';

import { type ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface AnalyticsMealRowProps {
  mealName: string;
  localizedName?: string | null;
  category: string;
  venue: string;
  rightContent: ReactNode;
  icon?: ReactNode;
  /** Optional subtitle shown under the meal name (e.g. "3 days ago") */
  subtitle?: ReactNode;
}

interface AnalyticsMealListProps {
  children: ReactNode;
}

export function AnalyticsMealList({ children }: AnalyticsMealListProps) {
  return <div className="grid gap-3 md:grid-cols-2">{children}</div>;
}

export function AnalyticsMealRow({
  mealName,
  localizedName,
  category,
  venue,
  rightContent,
  icon,
  subtitle,
}: AnalyticsMealRowProps) {
  const t = useTranslations();

  return (
    <Link
      href={`/${venue}/${mealName}`}
      className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted"
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          {icon}
          <span className="font-medium text-sm">{localizedName || mealName}</span>
          <Badge variant="default" className="text-[10px] px-1.5 py-0">
            {t(category)}
          </Badge>
        </div>
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>
      <div className="text-right flex-shrink-0">{rightContent}</div>
    </Link>
  );
}
