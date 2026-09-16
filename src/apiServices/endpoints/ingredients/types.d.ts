export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  vegan?: boolean;
  vegetarian?: boolean;
  glutenFree?: boolean;
  soyaFree?: boolean;
  nutFree?: boolean;
  servingSizeAmount: number;
  servingSizeUnit: string;
  state?: string;
  categoryId?: string;
  unitId?: string;
  category?: {
    id: string;
    name: string;
  };
  unit?: {
    id: string;
    name: string;
  };
}

export interface CreateIngredientResponse {
  data:{
  createIngredient: {
    ingredient: Ingredient;
    success: boolean;
    errors: string[];
  };
  }
}

export interface UpdateIngredientResponse {
  data:{
  updateIngredient: {
    ingredient: Ingredient;
    errors: string[];
  };
  }
}

export interface DeleteIngredientResponse {
  data:{
  deleteIngredient: {
    success: boolean;
    errors: string[];
  }
}
}

export interface GetIngredientResponse {
  getIngredient: Ingredient;
}

export interface GetAllIngredientsResponse {
  data: {
    allIngredients: Ingredient[];
  };
}

export interface CreateIngredientVariable {
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  vegan?: boolean;
  vegetarian?: boolean;
  glutenFree?: boolean;
  soyaFree?: boolean;
  nutFree?: boolean;
  servingSizeAmount: number;
  servingSizeUnit: string;
  state?: string;
  categoryId?: string;
  unitId?: string;
}

export interface UpdateIngredientVariable {
  id: string;
  name?: string;
  description?: string;
  state?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  vegan?: boolean;
  vegetarian?: boolean;
  glutenFree?: boolean;
  soyaFree?: boolean;
  nutFree?: boolean;
  servingSizeAmount?: number;
  servingSizeUnit?: string;
  categoryId?: string;
  unitId?: string;
}

// Raw shape returned/accepted by the REST backend (GET/POST/PUT
// /api/v1/ingredients) - see
// fitness-dashboard-backend/src/modules/ingredients/ingredients.schema.ts.
// GET list/detail include the full related `category`/`unit` records;
// mapped down to { id, name } to match the Ingredient type above.
export interface RestIngredient {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  vegan: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
  soyaFree: boolean;
  nutFree: boolean;
  servingSizeAmount: number;
  servingSizeUnit: string;
  state: 'active' | 'inactive';
  categoryId: string | null;
  unitId: string | null;
  category?: { id: string; name: string } | null;
  unit?: { id: string; name: string } | null;
}
