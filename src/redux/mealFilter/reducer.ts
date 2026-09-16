import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Meal } from "../../apiServices/endpoints/mealsFilter/types";

interface MealFilterState {
  meals: Meal[];
  selectedMeal: Meal | null;
  error: string | null;
  loading: boolean;
}

const initialState: MealFilterState = {
  meals: [],
  selectedMeal: null,
  error: null,
  loading: false,
};

const mealFilterSlice = createSlice({
  name: "mealFilter",
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setAllMeals: (state, { payload }: PayloadAction<Meal[]>) => {
      state.meals = payload;
      state.error = null;
    },
    setCreateMeal: (state, { payload }: PayloadAction<{ data?: { createMeal?: { meal: Meal; errors: string[] } } }>) => {
      if (payload.data?.createMeal?.meal) {
        state.meals = [...state.meals, payload.data.createMeal.meal];
        state.error = null;
      } else if (payload.data?.createMeal?.errors) {
        state.error = payload.data.createMeal.errors[0];
      }
    },
    setUpdateMeal: (state, { payload }: PayloadAction<{ data?: { updateMeal?: { meal: Meal; errors: string[] } } }>) => {
      if (payload.data?.updateMeal?.meal) {
        state.meals = state.meals.map(meal => 
          meal.id === payload.data.updateMeal.meal.id ? payload.data.updateMeal.meal : meal
        );
        state.error = null;
      } else if (payload.data?.updateMeal?.errors) {
        state.error = payload.data.updateMeal.errors[0];
      }
    },
    setDeleteMeal: (state, { payload }: PayloadAction<{ id: string; data?: { deleteMeal?: { success: boolean; errors: string[] } } }>) => {
      if (payload.data?.deleteMeal?.success) {
        state.meals = state.meals.filter(meal => meal.id !== payload.id);
        state.error = null;
      } else if (payload.data?.deleteMeal?.errors) {
        state.error = payload.data.deleteMeal.errors[0];
      }
    },
    setSelectedMeal: (state, { payload }: PayloadAction<Meal | null>) => {
      state.selectedMeal = payload;
    },
    clearMealError: (state) => {
      state.error = null;
    },
    filterMeals: (state, { payload }: PayloadAction<Meal[]>) => {
      state.meals = payload;
      state.loading = false;
    }
  },
});

export const { 
  setLoading,
  setAllMeals, 
  setCreateMeal, 
  setUpdateMeal, 
  setDeleteMeal, 
  setSelectedMeal,
  clearMealError,
  filterMeals
} = mealFilterSlice.actions;

export const mealFilterReducer = mealFilterSlice.reducer;