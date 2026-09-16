import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ingredientReducerState } from "./type";
import { Ingredient } from "../../apiServices/endpoints/ingredients/types";

const initialState: ingredientReducerState = {
  allIngredients: [],
  currentIngredient: null
};

const slice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.allIngredients = [...state.allIngredients, action.payload];
    },
    setIngredients: (state, action: PayloadAction<Ingredient[]>) => {
      state.allIngredients = action.payload;
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.allIngredients = state.allIngredients.filter(ing => ing.id !== action.payload);
    },
    updateIngredient: (state, action: PayloadAction<Ingredient>) => {
      const index = state.allIngredients.findIndex(ing => ing.id === action.payload.id);
      if (index !== -1) {
        state.allIngredients[index] = action.payload;
      }
    },
    setCurrentIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.currentIngredient = action.payload;
    }
  }
});

export const { 
  addIngredient, 
  setIngredients, 
  removeIngredient, 
  updateIngredient,
  setCurrentIngredient 
} = slice.actions;
export const ingredientReducer = slice.reducer;