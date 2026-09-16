export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  difficulty: number;
  servings: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  instructions: string[];
  recipeIngredients: Array<{
    id: string;
    ingredient: {
      id: string;
      name: string;
    };
    unit: {
      id: string;
      name: string;
    };
    minAmount: number;
    baseAmount: number;
    maxAmount: number;
    roundAmount: number;
    ingredientSubstitutes: Array<{
      id: string;
      substituteIngredient: {
        id: string;
        name: string;
      };
      unit: {
        id: string;
        name: string;
      };
      minAmount: number;
      baseAmount: number;
      maxAmount: number;
      roundAmount: number;
    }>;
  }>;
  isActive?: boolean;
}

export interface RecipeState {
  recipes: Recipe[];
  error: string | null;
}

export type CreateRecipeVariables = Omit<Recipe, 'id'>;

export interface RecipeResponse {
  recipe: Recipe;
  errors?: string[];
  success: boolean;
}

export interface AllRecipesResponse {
  data: {
    allRecipes: Recipe[];
  };
}

interface RecipeIngredientAttribute {
  id?: number;
  _destroy?: boolean;
  ingredientId: string;
  unitId: string;
  minAmount: number;
  baseAmount: number;
  maxAmount: number;
  roundAmount: number;
  substituteIngredientIds?: string[];
}

export interface CreateRecipeInput {
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  // "easy" | "medium" | "hard" - defaults to "medium" if omitted (the
  // config screen currently has this field commented out).
  difficulty?: 'easy' | 'medium' | 'hard';
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  instructions: string[];
  recipeIngredientsAttributes: RecipeIngredientAttribute[];
}

export interface UpdateRecipeInput extends CreateRecipeInput {
  id: string;
}

// Raw shapes returned/accepted by the REST backend (GET/POST/PUT
// /api/v1/recipes) - see
// fitness-dashboard-backend/src/modules/recipes/recipes.schema.ts. `GET /:id`
// (and the create/update responses, which use the same `detailInclude`)
// expand `recipeIngredients` -> `ingredient`/`unit`/`substitutes` ->
// `substituteIngredient`. Note: unlike the old GraphQL shape, an
// IngredientSubstitute row on the new backend carries no amounts/unit of its
// own - those are approximated from the parent RecipeIngredient when mapped
// to the frontend's `ingredientSubstitutes` shape.
export interface RestRecipeIngredient {
  id: string;
  minAmount: number;
  baseAmount: number;
  maxAmount: number;
  roundAmount: number;
  ingredient: { id: string; name: string };
  unit: { id: string; name: string };
  substitutes: Array<{
    id: string;
    substituteIngredient: { id: string; name: string };
  }>;
}

export interface RestRecipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  instructions: string[];
  recipeIngredients?: RestRecipeIngredient[];
}
