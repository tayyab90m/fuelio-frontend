import { AllGoalsResponse, MealTypesProps, MealUnitProps } from "../../interfaces/meal/types";
import { UserData } from "../../interfaces/user/types";

export interface MealReducerStates {
    allGeneralTypes: MealTypesProps[];
    isLoading: boolean;
    mealsCategories: MealCategoriesProps[];
    selectedMealType: MealTypesProps | null;
    mealUnits: MealUnitProps[],
}