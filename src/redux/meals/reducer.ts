import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MealReducerStates } from "./types";
import { MealTypesProps } from "../../interfaces/meal/types";
const initialState: MealReducerStates = {
    allGeneralTypes: [],
    mealsCategories:[],
    isLoading: false,
    selectedMealType: null,
    mealUnits: [],
};

const slice = createSlice({
    name: "meals",
    initialState,
    reducers: {
        setAllGeneralTypes: (state, action: PayloadAction<MealReducerStates['allGeneralTypes']>) => {
            state.allGeneralTypes = action.payload;
        },

        setAllMealUnits: (state, action: PayloadAction<MealReducerStates['mealUnits']>) => {
            state.mealUnits = action.payload;
        },

        addToAllGeneralTypes: (state, action: PayloadAction<MealReducerStates['allGeneralTypes']>) => {
            state.allGeneralTypes = [...state.allGeneralTypes, ...action.payload];
        },
        removeToAllGeneralTypes: (state, action: PayloadAction<string>) => {
            state.allGeneralTypes = state.allGeneralTypes.filter((item) => item.id !== action.payload);
        },
        
        setIsLoading: (state, action: PayloadAction<MealReducerStates['isLoading']>) => {
            state.isLoading = action.payload;
        },
        setSelectedMealType : (state, action: PayloadAction<MealTypesProps| null>) => {
         state.selectedMealType =action.payload
        },
        updateMealTypeState: (state, action: PayloadAction<{id: string, state: string}>) => {
            state.allGeneralTypes = state.allGeneralTypes.map(type => 
                type.id === action.payload.id 
                    ? { ...type, state: action.payload.state }
                    : type
            );
        },
    },
    extraReducers: (builder) => {
        builder.addCase("resetMealTypesState", () => {
            return initialState;
        });
    },
});

export const { setAllGeneralTypes, setIsLoading, setAllMealUnits, setSelectedMealType, removeToAllGeneralTypes, addToAllGeneralTypes, updateMealTypeState } = slice.actions;
export const mealsReducer = slice.reducer;
