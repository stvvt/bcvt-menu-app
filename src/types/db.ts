export type Meal = {
  name: string;
  price: number;
  currency: string;
  imageUrl?: string;
  ean?: string;
};

export type DailyMenu = {
  date: string;
  meals: Meal[];
};

export type MergedPrice = {
  dateText: string;
  date: string;
  price: string;
  currency?: string;
};

export type MergedImage = {
  date: string;
  imageUrl: string;
};

export type MergedMealItem = {
  name: string;
  prices: Array<MergedPrice>;
  images: Array<MergedImage>;
};

export type Merged = Array<MergedMealItem>;

export type Categories = Record<string, string>;