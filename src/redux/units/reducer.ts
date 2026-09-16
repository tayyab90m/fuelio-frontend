import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Unit {
    id: string;
    name: string;
}

interface UnitsState {
    units: Unit[];
}

const initialState: UnitsState = {
    units: []
};

const slice = createSlice({
    name: "units",
    initialState,
    reducers: {
        setUnits: (state, action: PayloadAction<Unit[]>) => {
            state.units = action.payload;
        }
    }
});

export const { setUnits } = slice.actions;
export const unitsReducer = slice.reducer; 