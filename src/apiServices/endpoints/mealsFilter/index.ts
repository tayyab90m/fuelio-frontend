import { apiDelete, apiGet, apiPost, apiPut } from "../../methods";
import {
  CreateMealInput,
  CreateMealResponse,
  DeleteMealResponse,
  GetAllMealsResponse,
  Meal,
  RestMeal,
  UpdateMealInput,
  UpdateMealResponse,
} from "./types";

const toMeal = (record: RestMeal): Meal => ({
  id: record.id,
  name: record.name,
  description: record.description,
  categories: record.categories,
  generalTypes: record.generalMealTypes,
  recipes: record.recipes,
});

const toRestBody = (input: CreateMealInput) => ({
  name: input.name,
  description: input.description,
  calories: input.calories,
  protein: input.protein,
  carbs: input.carbs,
  fat: input.fat,
  categoryIds: input.categoryIds,
  generalMealTypeIds: input.generalTypeIds,
  recipeIds: input.recipeIds,
});

export const allMealsApi = async (): Promise<GetAllMealsResponse> => {
  const { data } = await apiGet<{ data: RestMeal[] }>({ path: "/meals" });
  return { data: { allMeals: data.map(toMeal) } };
};

export const createMealApi = async (input: CreateMealInput): Promise<CreateMealResponse> => {
  const { data } = await apiPost<{ data: RestMeal }>({ path: "/meals", body: toRestBody(input) });
  return { data: { createMeal: { meal: toMeal(data), errors: [] } } };
};

export const updateMealApi = async ({ input }: UpdateMealInput): Promise<UpdateMealResponse> => {
  const { data } = await apiPut<{ data: RestMeal }>({
    path: `/meals/${input.id}`,
    body: toRestBody(input),
  });
  return { data: { updateMeal: { meal: toMeal(data), errors: [] } } };
};

export const deleteMealApi = async (id: string): Promise<DeleteMealResponse> => {
  await apiDelete({ path: `/meals/${id}` });
  return { data: { deleteMeal: { success: true, errors: [] } } };
};
