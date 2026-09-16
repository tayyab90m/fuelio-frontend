import { MealCategoryProps, MealTypesProps, MealUnitProps } from "../../../interfaces/meal/types";
import { MutationErrorProps } from "../../../interfaces/mutationErrors/types";

export interface CreateGeneralMealTypeBodyParams {
    name: string;
    description?: string; // Optional
    state?: string;
    proteinPercentage: number;
    carbsPercentage: number;
    fatsPercentage: number;
    minimumProtein: number;
    startTime: string; // Assuming ISO format for date-time
    endTime: string;   // Assuming ISO format for date-time
};
export interface GetGeneralMealTypeBodyParams {
    id: string;
};
export interface UpdateGeneralMealTypeBodyParams extends CreateGeneralMealTypeBodyParams {
    id: string;

};
export interface AllGeneralMealTypesResponseProps {
    data: {
        allGeneralTypes: MealTypesProps[];
    }
};

export interface AllMealUnitResponseProps {
    data: {
        allUnits: MealUnitProps[];
    }
};

export interface AllMealCategoryResponseProps {
    data: {
        allGeneralTypes: MealCategoryProps[];
    }
};
export interface GeneralMealTypeResponseProps {
    data: {
        generalType: MealTypesProps[];
        errors: MutationErrorProps[];
    }
};
export interface DeleteGeneralMealTypeResponseProps {
    data: {
        deleteGeneralType: {
            success: boolean;
            errors: MutationErrorProps[];
        }
    }
};
export interface DeleteGeneralMealCategoryResponseProps {
    data: {
        deleteCategory: {
            success: boolean;
            errors: MutationErrorProps[];
        }
    }
};

// Raw shape returned/accepted by the REST backend (GET/POST/PUT
// /api/v1/general-meal-types) - see
// fitness-dashboard-backend/src/modules/generalMealTypes/generalMealTypes.schema.ts.
// state: "active" | "inactive" (frontend uses "published"/"unpublished").
// There is no `code` field on the backend model - it's a legacy GraphQL-era
// field kept only because MealTypesProps/MealCategoryProps declare it.
export interface RestGeneralMealType {
    id: string;
    name: string;
    description: string;
    state: 'active' | 'inactive';
    proteinPercentage: number;
    carbsPercentage: number;
    fatsPercentage: number;
    minimumProtein: number;
    startTime: string;
    endTime: string;
}

// Raw shape returned by GET /api/v1/units (see the `units` endpoint folder
// for the canonical version of this type - duplicated here only to avoid a
// cross-folder import).
export interface RestUnit {
    id: string;
    name: string;
    short?: string | null;
    equivalentTo?: number | null;
    unitType?: string | null;
    system?: string | null;
}
