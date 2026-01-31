'use client';

import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Sparkles, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PriceChangeType = 'increase' | 'decrease' | 'new' | 'stable';

interface PriceChangeBadgeProps {
  changePercent?: number;
  isNew?: boolean;
  threshold?: number; // Minimum percentage to show as significant (default 5)
  showIcon?: boolean;
  size?: 'sm' | 'default';
}

function getChangeType(changePercent: number, threshold: number, isNew: boolean): PriceChangeType {
  if (isNew) return 'new';
  if (changePercent > threshold) return 'increase';
  if (changePercent < -threshold) return 'decrease';
  return 'stable';
}

const PriceChangeBadge = ({ 
  changePercent = 0, 
  isNew = false,
  threshold = 5,
  showIcon = true,
  size = 'default',
}: PriceChangeBadgeProps) => {
  const changeType = getChangeType(changePercent, threshold, isNew);

  if (changeType === 'stable') {
    return null; // Don't show badge for stable prices
  }

  const config = {
    increase: {
      label: `+${changePercent.toFixed(1)}%`,
      icon: TrendingUp,
      className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
    },
    decrease: {
      label: `${changePercent.toFixed(1)}%`,
      icon: TrendingDown,
      className: 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20',
    },
    new: {
      label: 'New',
      icon: Sparkles,
      className: 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20',
    },
    stable: {
      label: '~',
      icon: Minus,
      className: 'bg-muted text-muted-foreground',
    },
  };

  const { label, icon: Icon, className } = config[changeType];

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-medium',
        size === 'sm' && 'text-xs px-1.5 py-0',
        className
      )}
    >
      {showIcon && <Icon className={cn('mr-1', size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />}
      {label}
    </Badge>
  );
};

export default PriceChangeBadge;

// Helper to determine if a badge should be shown
export function shouldShowBadge(changePercent: number, isNew: boolean, threshold = 5): boolean {
  return isNew || Math.abs(changePercent) > threshold;
}
