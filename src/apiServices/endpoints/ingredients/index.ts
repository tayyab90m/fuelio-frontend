import { apiDelete, apiGet, apiPost, apiPut } from '../../methods';
import {
  CreateIngredientResponse,
  CreateIngredientVariable,
  DeleteIngredientResponse,
  GetAllIngredientsResponse,
  GetIngredientResponse,
  Ingredient,
  RestIngredient,
  UpdateIngredientResponse,
  UpdateIngredientVariable,
} from './types';

const toIngredient = (record: RestIngredient): Ingredient => ({
  id: record.id,
  name: record.name,
  description: record.description,
  calories: record.calories,
  protein: record.protein,
  fat: record.fat,
  carbs: record.carbs,
  vegan: record.vegan,
  vegetarian: record.vegetarian,
  glutenFree: record.glutenFree,
  soyaFree: record.soyaFree,
  nutFree: record.nutFree,
  servingSizeAmount: record.servingSizeAmount,
  servingSizeUnit: record.servingSizeUnit,
  state: record.state,
  categoryId: record.categoryId || undefined,
  unitId: record.unitId || undefined,
  category: record.category || undefined,
  unit: record.unit || undefined,
});

const toRestBody = (input: CreateIngredientVariable | UpdateIngredientVariable) => ({
  name: input.name,
  description: input.description,
  calories: input.calories,
  protein: input.protein,
  fat: input.fat,
  carbs: input.carbs,
  vegan: input.vegan,
  vegetarian: input.vegetarian,
  glutenFree: input.glutenFree,
  soyaFree: input.soyaFree,
  nutFree: input.nutFree,
  servingSizeAmount: input.servingSizeAmount,
  servingSizeUnit: input.servingSizeUnit,
  state: input.state,
  categoryId: input.categoryId,
  unitId: input.unitId,
});

export const createIngredient = async (variables: CreateIngredientVariable): Promise<CreateIngredientResponse> => {
  const { data } = await apiPost<{ data: RestIngredient }>({ path: '/ingredients', body: toRestBody(variables) });
  return { data: { createIngredient: { ingredient: toIngredient(data), success: true, errors: [] } } };
};

export const updateIngredient = async (variables: UpdateIngredientVariable): Promise<UpdateIngredientResponse> => {
  const { data } = await apiPut<{ data: RestIngredient }>({
    path: `/ingredients/${variables.id}`,
    body: toRestBody(variables),
  });
  return { data: { updateIngredient: { ingredient: toIngredient(data), errors: [] } } };
};

export const deleteIngredient = async (id: string): Promise<DeleteIngredientResponse> => {
  await apiDelete({ path: `/ingredients/${id}` });
  return { data: { deleteIngredient: { success: true, errors: [] } } };
};

export const getIngredient = async (id: string): Promise<GetIngredientResponse> => {
  const { data } = await apiGet<{ data: RestIngredient }>({ path: `/ingredients/${id}` });
  return { getIngredient: toIngredient(data) };
};

export const getAllIngredients = async (): Promise<GetAllIngredientsResponse> => {
  const { data } = await apiGet<{ data: RestIngredient[] }>({ path: '/ingredients' });
  return { data: { allIngredients: data.map(toIngredient) } };
};
