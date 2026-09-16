import { apiDelete, apiGet, apiPost, apiPut } from "../../methods";
import {
    CategoryWithDates,
    CreateCategoryInput,
    CreateCategoryResponse,
    DeleteCategoryResponse,
    GetAllCategoriesResponse,
    RestCategory,
    UpdateCategoryInput,
    UpdateCategoryResponse,
} from "./types";

const toCategory = (record: RestCategory): CategoryWithDates => ({
    id: record.id,
    name: record.name,
    description: record.description,
    sortingPriority: record.sortingPriority,
    proteinMin: record.proteinMin,
    proteinMax: record.proteinMax,
    fatMin: record.fatMin,
    fatMax: record.fatMax,
    carbsMin: record.carbsMin,
    carbsMax: record.carbsMax,
    minimalDailyCaloriesMen: record.minimalDailyCaloriesMen,
    minimalDailyCaloriesWomen: record.minimalDailyCaloriesWomen,
    mealSwapEnabled: record.mealSwapEnabled,
    toleranceOfTotalCalories: record.toleranceOfTotalCalories,
    unit: record.unit,
    // The REST "Category" resource has no relation to Goals.
    goalIds: [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
});

const toRestBody = (input: CreateCategoryInput) => ({
    name: input.name || '',
    description: input.description,
    sortingPriority: input.sortingPriority || 0,
    proteinMin: input.proteinMin || 0,
    proteinMax: input.proteinMax || 0,
    fatMin: input.fatMin || 0,
    fatMax: input.fatMax || 0,
    carbsMin: input.carbsMin || 0,
    carbsMax: input.carbsMax || 0,
    minimalDailyCaloriesMen: input.minimalDailyCaloriesMen || 0,
    minimalDailyCaloriesWomen: input.minimalDailyCaloriesWomen || 0,
    mealSwapEnabled: input.mealSwapEnabled || false,
    toleranceOfTotalCalories: input.toleranceOfTotalCalories || 0,
    unit: input.unit || 'g_per_kg_body_weight',
});

export const createCategory = async (input: CreateCategoryInput): Promise<CreateCategoryResponse> => {
    const { data } = await apiPost<{ data: RestCategory }>({
        path: "/categories",
        body: toRestBody(input),
    });
    return { data: { createCategory: { category: toCategory(data), errors: [] } } };
};

export const updateCategory = async (input: UpdateCategoryInput): Promise<UpdateCategoryResponse> => {
    const { data } = await apiPut<{ data: RestCategory }>({
        path: `/categories/${input.id}`,
        body: toRestBody(input),
    });
    return { data: { updateCategory: { category: toCategory(data), errors: [] } } };
};

export const deleteCategory = async (id: string): Promise<DeleteCategoryResponse> => {
    await apiDelete({ path: `/categories/${id}` });
    return { data: { deleteCategory: { success: true, errors: [] } } };
};

export const getAllCategories = async (): Promise<GetAllCategoriesResponse> => {
    const { data } = await apiGet<{ data: RestCategory[] }>({ path: "/categories" });
    return { data: { allCategories: data.map(toCategory) } };
};
