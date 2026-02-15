import type { Datasource } from './types';
import type { Merged, Categories, MealInfoData, DailyMenu } from '@/types/db';
import { readFile } from 'fs/promises';
import path from 'path';
import { isErrnoException, NotFoundError } from '@/errors/NotFoundError';

export class FileDatasource implements Datasource {
  constructor(private basePath: string) {}

  private async readJson<T>(relativePath: string): Promise<T> {
    const filePath = path.resolve(this.basePath, relativePath);
    try {
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (error) {
      if (isErrnoException(error) && error.code === 'ENOENT') {
        throw new NotFoundError(`File not found: ${filePath}`);
      }
      throw error;
    }
  }

  async getPriceHistory(): Promise<Merged> {
    return this.readJson<Merged>('merged.json');
  }

  async getCategories(): Promise<Categories> {
    return this.readJson<Categories>('categories.json');
  }

  async getMealInfo(): Promise<MealInfoData> {
    return this.readJson<MealInfoData>('categories_rich.json');
  }

  async getDailyMenu(date: string): Promise<DailyMenu> {
    return this.readJson<DailyMenu>(`daily/${date}.json`);
  }
}
