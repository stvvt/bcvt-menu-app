export type Price = {
  price: string;
  currency?: string;
  weight?: string;
  unit?: string;
};

export type Meal = Price & {
  name: string;
  imageUrl?: string;
  ean?: string;
};

export type DailyMenu = {
  date: string;
  meals: Meal[];
};

export type MergedPrice = Price & {
  dateText: string;
  date: string;
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