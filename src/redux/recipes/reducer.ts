import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeState } from "./types";
import { Recipe } from "../../apiServices/endpoints/recipes/types";

const initialState: RecipeState = {
  recipes: [],
  error: null,
  loading: false
};

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setAllRecipes: (state, { payload }: PayloadAction<Recipe[]>) => {
      state.recipes = payload;
      state.error = null;
    },
    addRecipe: (state, { payload }: PayloadAction<Recipe>) => {
      state.recipes.push(payload);
      state.error = null;
    },
    deleteRecipe: (state, { payload }: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(recipe => recipe.id !== payload);
      state.error = null;
    },
    updateRecipe: (state, { payload }: PayloadAction<Recipe>) => {
      state.recipes = state.recipes.map(recipe =>
        recipe.id === payload.id ? {
          ...payload,
          // nutrients: {} as any
        } : recipe
      );
      state.error = null;
    },
    setRecipeError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    }
  },
});

export const {
  setAllRecipes,
  addRecipe,
  deleteRecipe,
  updateRecipe,
  setRecipeError
} = recipeSlice.actions;

export const recipeReducer = recipeSlice.reducer;