export interface CreateCategoryInput {
    name: string;
    description?: string;
    goalIds?: string[];
    sortingPriority?: number;
    proteinMin?: number;
    proteinMax?: number;
    fatMin?: number;
    fatMax?: number;
    carbsMin?: number;
    carbsMax?: number;
    minimalDailyCaloriesMen?: number;
    minimalDailyCaloriesWomen?: number;
    mealSwapEnabled?: boolean;
    toleranceOfTotalCalories?: number;
    unit?: string;
    goals?: Array<{ id: string; name: string; }>;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    sortingPriority: number;
    proteinMin: number;
    proteinMax: number;
    fatMin: number;
    fatMax: number;
    carbsMin: number;
    carbsMax: number;
    minimalDailyCaloriesMen: number;
    minimalDailyCaloriesWomen: number;
    mealSwapEnabled: boolean;
    toleranceOfTotalCalories: number;
    unit: string;
    goalIds: Array<{
        id: string;
        name: string;
    }>;
}

export interface CreateCategoryResponse {
    data: {
        createCategory: {
            category: Category;
            errors: string[];
        }
    }
}

export interface UpdateCategoryInput extends CreateCategoryInput {
    id: string;
}

export interface UpdateCategoryResponse {
    data: {
        updateCategory: {
            category: Category;
            errors: string[];
        }
    }
}

export interface DeleteCategoryResponse {
    data: {
        deleteCategory: {
            success: boolean;
            errors: string[];
        }
    }
}

export interface CategoryWithDates extends Category {
    createdAt: string;
    updatedAt: string;
}

export interface GetAllCategoriesResponse {
    data: {
        allCategories: CategoryWithDates[];
    }
}

// Raw shape returned/accepted by the REST backend (GET/POST/PUT
// /api/v1/categories) - see
// fitness-dashboard-backend/src/modules/categories/categories.schema.ts.
// Note: the nutrition-plan "Category" resource has no relation to Goals on
// the new backend (goalIds is a legacy GraphQL-era field, kept in the
// frontend types/UI but never sent to or read from the server).
export interface RestCategory {
    id: string;
    name: string;
    description: string;
    sortingPriority: number;
    proteinMin: number;
    proteinMax: number;
    fatMin: number;
    fatMax: number;
    carbsMin: number;
    carbsMax: number;
    minimalDailyCaloriesMen: number;
    minimalDailyCaloriesWomen: number;
    mealSwapEnabled: boolean;
    toleranceOfTotalCalories: number;
    unit: string;
    createdAt: string;
    updatedAt: string;
}
