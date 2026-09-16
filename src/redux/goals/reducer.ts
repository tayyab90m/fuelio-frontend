import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AllGoals } from "./types";
import { CreateGoalResponse, Goal } from "../../apiServices/endpoints/goals/types";

const initialState: AllGoals = {
  goals: [],
  error: null,
};

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    setAllGoals: (state, { payload }: PayloadAction<Goal[]>) => {
      state.goals = payload;
      state.error = null;
    },
    setCreateGoals:(state, { payload }: PayloadAction<CreateGoalResponse>) => {
      if (payload.data?.createGoal?.goal) {
        state.goals = [...state.goals, payload.data.createGoal.goal];
        state.error = null;
      } else if (payload.data?.createGoal?.errors) {
        state.error = payload.data.createGoal.errors[0];
      }
    },
    deleteGoal: (state, { payload }: PayloadAction<string>) => {
      state.goals = state.goals.filter(goal => goal.id !== payload);
      state.error = null;
    },
    updateGoalState: (state, { payload }: PayloadAction<Goal>) => {
      state.goals = state.goals.map(goal => 
        goal.id === payload.id ? payload : goal
      );
      state.error = null;
    },
    clearGoalError: state => {
      state.error = null;
    }
  },
});

export const { 
  setCreateGoals, 
  setAllGoals, 
  clearGoalError, 
  deleteGoal, 
  updateGoalState 
} = goalsSlice.actions;

export const goalsReducer = goalsSlice.reducer;