import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CuisineState } from "./types";
import { Cuisine } from "../../apiServices/endpoints/cuisine/types";

const initialState: CuisineState = {
  cuisines: [],
  error: null,
};

const cuisineSlice = createSlice({
  name: "cuisine",
  initialState,
  reducers: {
    setAllCuisines: (state, { payload }: PayloadAction<Cuisine[]>) => {
      state.cuisines = payload;
      state.error = null;
    },
    addCuisine: (state, { payload }: PayloadAction<Cuisine>) => {
      state.cuisines.push(payload);
      state.error = null;
    },
    deleteCuisine: (state, { payload }: PayloadAction<string>) => {
      state.cuisines = state.cuisines.filter(cuisine => cuisine.id !== payload);
      state.error = null;
    },
    updateCuisine: (state, { payload }: PayloadAction<Cuisine>) => {
      state.cuisines = state.cuisines.map(cuisine => 
        cuisine.id === payload.id ? payload : cuisine
      );
      state.error = null;
    },
    setCuisineError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    }
  },
});

export const { 
  setAllCuisines, 
  addCuisine, 
  deleteCuisine, 
  updateCuisine,
  setCuisineError 
} = cuisineSlice.actions;

export const cuisineReducer = cuisineSlice.reducer;
