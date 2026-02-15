import type { Merged, Categories, MealInfoData, DailyMenu } from '@/types/db';

export interface Datasource {
  getPriceHistory(): Promise<Merged>;
  getCategories(): Promise<Categories>;
  getMealInfo(): Promise<MealInfoData>;
  getDailyMenu(date: string): Promise<DailyMenu>; // date = YYYY-MM-DD
}

export type DatasourceConfig =
  | { type: 'httpJson'; baseUrl: string }
  | { type: 'file'; basePath: string }
  | { type: 'database'; connectionString: string }
  | { type: 'restApi'; baseUrl: string; apiKey?: string };

export type DatasourceOverrides = {
  [venueId: string]: Partial<DatasourceConfig> | undefined;
};
