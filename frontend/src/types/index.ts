export interface DiningHall {
  id: number;
  name: string;
  location: string;
  meals?: Meal[];
}

export interface Meal {
  id: number;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  calories: number;
  serving_size: string;
  dining_hall_id: number;
  dining_hall?: DiningHall;
}

export interface NutrientFilterParams {
  nutrient: string;
  amount: number;
} 