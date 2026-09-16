import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserState } from "./types";
const initialState: UserState = {
    userData: {
        success: false,
        errors: [],
        user: undefined,
        token: undefined,
    },
};

const slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UserState['userData']>) => {
            state.userData = action.payload;
        },
    },
});

export const { setUserData } = slice.actions;
export const userReducer = slice.reducer;
