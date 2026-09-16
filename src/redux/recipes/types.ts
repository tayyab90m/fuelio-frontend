import { Recipe } from "../../apiServices/endpoints/recipes/types";

export interface RecipeState {
  recipes: Recipe[];
  error: string | null;
  loading: boolean;
} 