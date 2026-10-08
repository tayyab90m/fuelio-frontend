import { MealTypesProps, MealUnitProps } from "../../interfaces/meal/types";

export interface MealReducerStates {
    allGeneralTypes: MealTypesProps[];
    isLoading: boolean;
    mealsCategories: MealCategoriesProps[];
    selectedMealType: MealTypesProps | null;
    mealUnits: MealUnitProps[],
}