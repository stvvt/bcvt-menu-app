'use client';

import { type PriceHistoryItem } from '@/types/app';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';
import { format } from 'date-fns';

interface PriceTrendChartProps {
  priceHistory: PriceHistoryItem[];
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
}

interface ChartDataPoint {
  date: string;
  dateLabel: string;
  price: number;
  delta: number;
}

const PriceTrendChart = ({ 
  priceHistory, 
  height = 300,
  showGrid = true,
  showAxis = true,
}: PriceTrendChartProps) => {
  const chartData = useMemo<ChartDataPoint[]>(() => {
    return priceHistory
      .slice()
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((item) => ({
        date: item.date.toISOString(),
        dateLabel: format(item.date, 'MMM d, yyyy'),
        price: item.amount,
        delta: item.delta,
      }));
  }, [priceHistory]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No price data available
      </div>
    );
  }

  const minPrice = Math.min(...chartData.map(d => d.price)) * 0.95;
  const maxPrice = Math.max(...chartData.map(d => d.price)) * 1.05;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
        {showAxis && (
          <>
            <XAxis 
              dataKey="dateLabel" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toFixed(2)}
              className="text-muted-foreground"
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value, name) => {
            if (name === 'price' && typeof value === 'number') {
              return [value.toFixed(2), 'Price'];
            }
            return [value ?? 0, name ?? ''];
          }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceTrendChart;
