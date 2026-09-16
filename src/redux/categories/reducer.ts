import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryState } from "./types";
import { CategoryWithDates } from "../../apiServices/endpoints/categories/types";

const initialState: CategoryState = {
  categories: [],
  error: null,
  loading: false
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setCategories: (state, { payload }: PayloadAction<CategoryWithDates[]>) => {
      state.categories = payload;
      state.error = null;
    },
    addCategory: (state, { payload }: PayloadAction<CategoryWithDates>) => {
      state.categories.push(payload);
      state.error = null;
    },
    updateCategory: (state, { payload }: PayloadAction<CategoryWithDates>) => {
      state.categories = state.categories.map(category =>
        category.id === payload.id ? payload : category
      );
      state.error = null;
    },
    removeCategory: (state, { payload }: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category.id !== payload);
      state.error = null;
    },
    setError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    }
  }
});

export const {
  setLoading,
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  setError
} = categorySlice.actions;

export const categoryReducer = categorySlice.reducer;
