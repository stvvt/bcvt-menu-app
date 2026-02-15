import type { Datasource } from './types';
import type { Merged, Categories, MealInfoData, DailyMenu } from '@/types/db';
import { NotFoundError } from '@/errors/NotFoundError';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export class HttpJsonDatasource implements Datasource {
  constructor(private baseUrl: string) {}

  private async fetchJson<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}/${path}`;
    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError(`${response.statusText}: ${url}`);
      }
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async getPriceHistory(): Promise<Merged> {
    return this.fetchJson<Merged>('merged.json');
  }

  async getCategories(): Promise<Categories> {
    return this.fetchJson<Categories>('categories.json');
  }

  async getMealInfo(): Promise<MealInfoData> {
    return this.fetchJson<MealInfoData>('categories_rich.json');
  }

  async getDailyMenu(date: string): Promise<DailyMenu> {
    return this.fetchJson<DailyMenu>(`daily/${date}.json`);
  }
}
