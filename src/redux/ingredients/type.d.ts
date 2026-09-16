import { Ingredient } from "../../apiServices/endpoints/ingredients/types";

export interface ingredientReducerState {
  allIngredients: Ingredient[];
  currentIngredient: Ingredient | null;
}