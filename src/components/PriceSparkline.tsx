'use client';

import { type PriceHistoryItem } from '@/types/app';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

interface PriceSparklineProps {
  priceHistory: PriceHistoryItem[];
  width?: number;
  height?: number;
  showTrend?: boolean;
}

const PriceSparkline = ({ 
  priceHistory, 
  width = 80, 
  height = 24,
  showTrend = true,
}: PriceSparklineProps) => {
  const { chartData, trend } = useMemo(() => {
    const sorted = priceHistory
      .slice()
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    const data = sorted.map((item) => ({
      price: item.amount,
    }));

    // Calculate trend based on first and last price
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    if (sorted.length >= 2) {
      const firstPrice = sorted[0].amount;
      const lastPrice = sorted[sorted.length - 1].amount;
      const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;
      
      if (percentChange > 1) {
        trendDirection = 'up';
      } else if (percentChange < -1) {
        trendDirection = 'down';
      }
    }

    return { chartData: data, trend: trendDirection };
  }, [priceHistory]);

  if (chartData.length < 2) {
    return null;
  }

  const strokeColor = showTrend
    ? trend === 'up'
      ? 'hsl(var(--destructive))'
      : trend === 'down'
      ? 'hsl(142.1 76.2% 36.3%)' // green
      : 'hsl(var(--muted-foreground))'
    : 'hsl(var(--primary))';

  return (
    <div style={{ width, height }} className="inline-block">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceSparkline;
