import { apiDelete, apiGet, apiPost, apiPut } from "../../methods";
import {
  AllRecipesResponse,
  CreateRecipeInput,
  Recipe,
  RecipeResponse,
  RestRecipe,
  RestRecipeIngredient,
  UpdateRecipeInput,
} from "./types";

const toRecipeIngredient = (ri: RestRecipeIngredient): Recipe['recipeIngredients'][number] => ({
  id: ri.id,
  ingredient: ri.ingredient,
  unit: ri.unit,
  minAmount: ri.minAmount,
  baseAmount: ri.baseAmount,
  maxAmount: ri.maxAmount,
  roundAmount: ri.roundAmount,
  ingredientSubstitutes: (ri.substitutes || []).map((sub) => ({
    id: sub.id,
    substituteIngredient: sub.substituteIngredient,
    unit: sub.unit,
    minAmount: sub.minAmount,
    baseAmount: sub.baseAmount,
    maxAmount: sub.maxAmount,
    roundAmount: sub.roundAmount,
  })),
});

const toRecipe = (record: RestRecipe): Recipe => ({
  id: record.id,
  name: record.name,
  description: record.description,
  prepTime: record.prepTime,
  cookTime: record.cookTime,
  difficulty: record.difficulty === 'easy' ? 1 : record.difficulty === 'hard' ? 3 : 2,
  servings: record.servings,
  calories: record.calories,
  protein: record.protein,
  carbs: record.carbs,
  fat: record.fat,
  instructions: record.instructions,
  recipeIngredients: (record.recipeIngredients || []).map(toRecipeIngredient),
  // The backend has no active/inactive flag for recipes.
  isActive: true,
});

const toRestBody = (input: CreateRecipeInput) => ({
  name: input.name,
  description: input.description,
  prepTime: input.prepTime,
  cookTime: input.cookTime,
  difficulty: input.difficulty || 'medium',
  servings: input.servings,
  calories: input.calories,
  protein: input.protein,
  carbs: input.carbs,
  fat: input.fat,
  instructions: input.instructions,
  recipeIngredients: (input.recipeIngredientsAttributes || [])
    .filter((attr) => !attr._destroy)
    .map((attr) => ({
      ingredientId: attr.ingredientId,
      unitId: attr.unitId,
      minAmount: attr.minAmount,
      baseAmount: attr.baseAmount,
      maxAmount: attr.maxAmount,
      roundAmount: attr.roundAmount,
      substitutes: attr.substitutes?.map((sub) => ({
        substituteIngredientId: sub.substituteIngredientId,
        unitId: sub.unitId,
        minAmount: sub.minAmount,
        baseAmount: sub.baseAmount,
        maxAmount: sub.maxAmount,
        roundAmount: sub.roundAmount,
      })),
    })),
});

export const allRecipesApi = async (): Promise<AllRecipesResponse> => {
  const { data } = await apiGet<{ data: RestRecipe[] }>({ path: "/recipes" });
  return { data: { allRecipes: data.map(toRecipe) } };
};

export const createRecipeApi = async (
  input: CreateRecipeInput
): Promise<{ data: { createRecipe: RecipeResponse } }> => {
  const { data } = await apiPost<{ data: RestRecipe }>({ path: "/recipes", body: toRestBody(input) });
  return { data: { createRecipe: { recipe: toRecipe(data), success: true, errors: [] } } };
};

export const updateRecipeApi = async (
  input: UpdateRecipeInput
): Promise<{ data: { updateRecipe: RecipeResponse } }> => {
  const { data } = await apiPut<{ data: RestRecipe }>({
    path: `/recipes/${input.id}`,
    body: toRestBody(input),
  });
  return { data: { updateRecipe: { recipe: toRecipe(data), success: true, errors: [] } } };
};

export const deleteRecipeApi = async (id: string): Promise<{ data: { deleteRecipe: RecipeResponse } }> => {
  await apiDelete({ path: `/recipes/${id}` });
  return {
    data: {
      deleteRecipe: {
        recipe: undefined as unknown as Recipe,
        success: true,
        errors: [],
      },
    },
  };
};
