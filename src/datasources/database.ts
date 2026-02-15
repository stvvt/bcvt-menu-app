import type { Datasource } from './types';
import type { Merged, Categories, MealInfoData, DailyMenu } from '@/types/db';

export class DatabaseDatasource implements Datasource {
  constructor(private _connectionString: string) {}

  getPriceHistory(): Promise<Merged> {
    throw new Error('DatabaseDatasource.getPriceHistory() not implemented');
  }

  getCategories(): Promise<Categories> {
    throw new Error('DatabaseDatasource.getCategories() not implemented');
  }

  getMealInfo(): Promise<MealInfoData> {
    throw new Error('DatabaseDatasource.getMealInfo() not implemented');
  }

  getDailyMenu(_date: string): Promise<DailyMenu> {
    throw new Error('DatabaseDatasource.getDailyMenu() not implemented');
  }
}
