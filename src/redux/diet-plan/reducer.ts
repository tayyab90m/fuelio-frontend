import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DietPlanStateProps } from './types';

const initialState: DietPlanStateProps = {
  data: undefined,
  isLoading: false, // Track the loading state
};

const dietPlanSlice = createSlice({
  name: 'dietPlan',
  initialState,
  reducers: {
    setData: (state, { payload }: PayloadAction<DietPlanStateProps['data']>) => {
      state.data = payload;
    },
    setIsLoading: (state, { payload }: PayloadAction<DietPlanStateProps['isLoading']>) => {
      state.isLoading = payload;
    },
  },
});

export const {
  setData,
  setIsLoading
} = dietPlanSlice.actions;
export const dietPlanReducer = dietPlanSlice.reducer;
