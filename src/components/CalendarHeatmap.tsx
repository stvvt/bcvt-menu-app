'use client';

import { useCallback, useMemo } from 'react';
import {
  eachDayOfInterval,
  startOfWeek,
  format,
  getDay,
  addDays,
} from 'date-fns';
import { bg } from 'date-fns/locale/bg';
import { it } from 'date-fns/locale/it';
import { enUS } from 'date-fns/locale/en-US';
import { useTranslations, useLocale } from 'next-intl';
import type { Locale } from 'date-fns';
import type { DailyPriceChangeData } from '@/utils/analyticsCalculations';

const dateFnsLocales: Record<string, Locale> = { en: enUS, bg, it };

interface CalendarHeatmapProps {
  data: DailyPriceChangeData;
  from: Date;
  to: Date;
}

/**
 * Map a count to a color intensity level (0-4).
 */
function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Tailwind classes for each intensity level.
 * Uses red tones for activity intensity.
 * Dark mode variants ensure visibility on dark backgrounds.
 */
const levelClasses: Record<number, string> = {
  0: 'bg-muted',
  1: 'bg-red-200 dark:bg-red-900',
  2: 'bg-red-300 dark:bg-red-700',
  3: 'bg-red-500 dark:bg-red-500',
  4: 'bg-red-700 dark:bg-red-300',
};

/** Pixel size of each cell and the gap between them. */
const CELL_PX = 12;
const GAP_PX = 2;

/** First day with actual data -- never render heatmap cells before this date. */
const DATA_START = new Date(2025, 5, 25); // 2025-06-25

/** Minimum column distance between two month labels to avoid overlap. */
const MIN_LABEL_GAP_COLS = 3;

const CalendarHeatmap = ({ data, from: rawFrom, to }: CalendarHeatmapProps) => {
  const ta = useTranslations('analytics');
  const locale = useLocale();
  const dfLocale = dateFnsLocales[locale] ?? enUS;
  const fmt = useCallback(
    (date: Date, pattern: string) => format(date, pattern, { locale: dfLocale }),
    [dfLocale],
  );

  // Clamp the effective start so we never show dates before the first data day
  const from = rawFrom < DATA_START ? DATA_START : rawFrom;

  // Localized day-of-week labels: Mon, (blank), Wed, (blank), Fri, (blank), (blank)
  const dayLabels = useMemo(() => {
    // Build reference dates for Mon(0)..Sun(6) using the week of `from`
    const weekStart = startOfWeek(from, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      if (i === 0 || i === 2 || i === 4) {
        return fmt(addDays(weekStart, i), 'EEE');
      }
      return '';
    });
  }, [from, fmt]);

  const { weeks, monthLabels } = useMemo(() => {
    // Align the start to the Monday of the week containing `from`
    const gridStart = startOfWeek(from, { weekStartsOn: 1 });
    const allDays = eachDayOfInterval({ start: gridStart, end: to });

    // Group days into weeks (arrays of 7)
    const weekGroups: Date[][] = [];
    let currentWeek: Date[] = [];
    for (const day of allDays) {
      // getDay: 0=Sun..6=Sat -> convert to Mon=0..Sun=6
      const dow = (getDay(day) + 6) % 7;
      if (dow === 0 && currentWeek.length > 0) {
        weekGroups.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    }
    if (currentWeek.length > 0) {
      // Pad the last week to 7 days so the grid stays uniform
      while (currentWeek.length < 7) {
        currentWeek.push(addDays(currentWeek[currentWeek.length - 1], 1));
      }
      weekGroups.push(currentWeek);
    }

    // Build month labels at the first week of each new month within the range,
    // skipping labels that are too close to the previous one.
    const labels: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;
    weekGroups.forEach((week, weekIdx) => {
      for (const day of week) {
        const m = day.getMonth();
        if (m !== lastMonth && day >= from && day <= to) {
          const prevCol = labels.length > 0 ? labels[labels.length - 1].colIndex : -MIN_LABEL_GAP_COLS;
          if (weekIdx - prevCol >= MIN_LABEL_GAP_COLS) {
            labels.push({ label: fmt(day, 'MMM'), colIndex: weekIdx });
          }
          lastMonth = m;
          break;
        }
      }
    });

    // Ensure the first month is always labelled
    if (labels.length === 0 || labels[0].colIndex !== 0) {
      labels.unshift({ label: fmt(from, 'MMM'), colIndex: 0 });
    }

    return { weeks: weekGroups, monthLabels: labels };
  }, [from, to, fmt]);

  // Width of the day-of-week label column
  const dayLabelWidth = 28; // px
  const dayLabelMargin = 4; // px (mr-1)
  const leftOffset = dayLabelWidth + dayLabelMargin;
  const colStep = CELL_PX + GAP_PX; // center-to-center distance between columns

  return (
    <div className="space-y-2">
      {/* Scrollable container for narrow screens */}
      <div className="overflow-x-auto">
        <div
          className="relative min-w-fit"
          style={{ paddingTop: '1.25rem' }} /* room for month labels */
        >
          {/* Month labels – absolutely positioned so they align with cell columns */}
          {monthLabels.map((m) => (
            <span
              key={m.colIndex}
              className="absolute top-0 text-xs text-muted-foreground whitespace-nowrap"
              style={{ left: leftOffset + m.colIndex * colStep }}
            >
              {m.label}
            </span>
          ))}

          {/* Grid: rows = days of week, columns = weeks */}
          <div className="flex">
            {/* Day-of-week labels */}
            <div
              className="flex flex-col shrink-0"
              style={{
                width: dayLabelWidth,
                marginRight: dayLabelMargin,
                gap: GAP_PX,
              }}
            >
              {dayLabels.map((label, i) => (
                <div
                  key={i}
                  className="text-[10px] text-muted-foreground leading-none flex items-center"
                  style={{ height: CELL_PX }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div className="flex" style={{ gap: GAP_PX }}>
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col" style={{ gap: GAP_PX }}>
                  {week.map((day, dayIdx) => {
                    const key = format(day, 'yyyy-MM-dd');
                    const count = data[key] ?? 0;
                    const level = getLevel(count);
                    const isOutOfRange = day < from || day > to;

                    return (
                      <div
                        key={dayIdx}
                        title={
                          isOutOfRange
                            ? undefined
                            : `${fmt(day, 'PP')}: ${ta('changes', { count })}`
                        }
                        className={`rounded-[2px] ${
                          isOutOfRange ? 'bg-transparent' : levelClasses[level]
                        }`}
                        style={{ width: CELL_PX, height: CELL_PX }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <span>{ta('less')}</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`rounded-[2px] ${levelClasses[level]}`}
            style={{ width: CELL_PX, height: CELL_PX }}
          />
        ))}
        <span>{ta('more')}</span>
      </div>
    </div>
  );
};

export default CalendarHeatmap;
