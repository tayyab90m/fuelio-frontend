import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActivityLevelState } from "./types";
import { ActivityLevel, ActivityLevelResponse } from "../../apiServices/endpoints/activity/type";

const initialState: ActivityLevelState = {
  activityLevels: [],
  error: null,
};

const activityLevelSlice = createSlice({
  name: "activityLevels",
  initialState,
  reducers: {
    setAllActivityLevels: (state, { payload }: PayloadAction<ActivityLevelState['activityLevels']>) => {
      state.activityLevels = payload;
      state.error = null;
    },
    setCreateActivityLevel: (state, { payload }: PayloadAction<{activityLevel: ActivityLevel, errors: string[]}>) => {
      if (payload.activityLevel) {
        state.activityLevels = [...state.activityLevels, payload.activityLevel];
        state.error = null;
      } else if (payload.errors) {
        state.error = payload.errors[0];
      }
    },
    updateActivityLevel: (state, { payload }: PayloadAction<ActivityLevel>) => {
      state.activityLevels = state.activityLevels.map(level =>
        level.id === payload.id ? payload : level
      );
      state.error = null;
    },
    deleteActivityLevel: (state, { payload }: PayloadAction<string>) => {
      state.activityLevels = state.activityLevels.filter(level => level.id !== payload);
      state.error = null;
    },
    clearActivityLevelError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAllActivityLevels,
  setCreateActivityLevel,
  updateActivityLevel,
  deleteActivityLevel,
  clearActivityLevelError,
} = activityLevelSlice.actions;

export const activityLevelReducer = activityLevelSlice.reducer;
