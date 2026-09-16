import { MealDataProps } from "../../interfaces/meal/types";

export interface MacrosProps {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}
export interface MacrosDistributionProps {
  name: string;
  timing: string;
  description: string;
  macros: MacrosProps;
}
export interface ShoppingListItem {
  id: string;
  name: string;
  base_amount: number;
  unit: string;
}

export interface DietPlanStateProps {
  data?: {
    submitAnswer: any;
    macros: MacrosProps;
    macrosDistribution: MacrosDistributionProps[];
    mealFramework: {
      data: {
        day: string;
        meals: MealDataProps[];
      }[];
      shopping_list: Record<string, {
        id: string;
        name: string;
        min_amount: number;
        base_amount: number;
        max_amount: number;
        round_amount: number;
        unit: string;
      }>;
    };
  };
  isLoading: boolean;
}

