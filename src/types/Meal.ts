export type Meal = {
  name: string;
  price: string;
  currency?: string;
  category?: string;
};

export type MealGroup = {
  category?: string;
  meals: Meal[];
};
