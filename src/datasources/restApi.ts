import type { Datasource } from './types';
import type { Merged, Categories, MealInfoData, DailyMenu } from '@/types/db';

export class RestApiDatasource implements Datasource {
  constructor(
    private _baseUrl: string,
    private _apiKey?: string,
  ) {}

  getPriceHistory(): Promise<Merged> {
    throw new Error('RestApiDatasource.getPriceHistory() not implemented');
  }

  getCategories(): Promise<Categories> {
    throw new Error('RestApiDatasource.getCategories() not implemented');
  }

  getMealInfo(): Promise<MealInfoData> {
    throw new Error('RestApiDatasource.getMealInfo() not implemented');
  }

  getDailyMenu(_date: string): Promise<DailyMenu> {
    throw new Error('RestApiDatasource.getDailyMenu() not implemented');
  }
}
