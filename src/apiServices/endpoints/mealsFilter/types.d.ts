export interface CreateMealInput {
  name: string;
  description: string;
  categoryIds: string[];
  generalTypeIds: string[];
  recipeIds: string[];
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface UpdateMealInputData {
  id: string;
  name: string;
  description: string;
  categoryIds: string[];
  generalTypeIds: string[];
  recipeIds: string[];
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface UpdateMealInput {
  input: UpdateMealInputData;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  categories: {
    id: string;
    name: string;
  }[];
  generalTypes: {
    id: string;
    name: string;
  }[];
  recipes: {
    id: string;
    name: string;
  }[];
}

export interface CreateMealResponse {
  data?: {
    createMeal?: {
      meal: Meal;
      errors: string[];
    };
  };
}

export interface UpdateMealResponse {
  data?: {
    updateMeal?: {
      meal: Meal;
      errors: string[];
    };
  };
}

export interface DeleteMealResponse {
  data?: {
    deleteMeal?: {
      success: boolean;
      errors: string[];
    };
  };
}

export interface GetMealResponse {
  data?: {
    meal?: Meal;
  };
}

export interface GetAllMealsResponse {
  data?: {
    allMeals?: Meal[];
  };
}

// Raw shape returned/accepted by the REST backend (GET/POST/PUT
// /api/v1/meals) - see
// fitness-dashboard-backend/src/modules/meals/meals.schema.ts. Includes the
// expanded `categories`/`generalMealTypes`/`recipes` relations on every
// read; accepts `categoryIds`/`generalMealTypeIds`/`recipeIds` (connect /
// replace-all `set`) on write.
export interface RestMeal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  categories: { id: string; name: string }[];
  generalMealTypes: { id: string; name: string }[];
  recipes: { id: string; name: string }[];
}
