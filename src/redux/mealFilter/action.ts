import { allGoalsApi, createGoalsApi, deleteGoalApi, toggleGoalStateApi, updateGoalApi } from "../../apiServices/endpoints/goals";
import { setIsLoading } from "../meals/reducer";
import { store } from "../store";
import { toast } from "react-toastify";
import { 
  allMealsApi, 
  createMealApi, 
  updateMealApi, 
  deleteMealApi 
} from "../../apiServices/endpoints/mealsFilter";
import { 
  CreateMealInput, 
  UpdateMealInput,
  UpdateMealInputData
} from "../../apiServices/endpoints/mealsFilter/types";
import { 
  setCreateMeal, 
  setLoading, 
  setAllMeals, 
  setUpdateMeal, 
  setDeleteMeal,
  filterMeals
} from "./reducer";
import { AppDispatch } from '../store';

const handleError = (message: string) => {
  toast.error(message);
  store.dispatch(setLoading(false));
};

export const onGetAllMeals = async () => {
  try {
    store.dispatch(setLoading(true));
    const response = await allMealsApi();
    store.dispatch(setAllMeals(response?.data?.allMeals || []));
  } catch (error) {
    toast.error('Failed to fetch meals');
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const onCreateMeal = async (input: CreateMealInput) => {
  try {
    store.dispatch(setLoading(true));
    const response = await createMealApi({
      ...input,
      recipeIds: input.recipeIds || []
    });
    store.dispatch(setCreateMeal(response));
    if (response?.data?.createMeal?.meal) {
      toast.success('Meal created successfully');
    }
  } catch (error) {
    toast.error('Failed to create meal');
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const onUpdateMeal = async (params: UpdateMealInputData) => {
  try {
    store.dispatch(setLoading(true));
    const payload: UpdateMealInput = {
      input: {
        id: params.id,
        name: params.name,
        description: params.description,
        categoryIds: params.categoryIds,
        generalTypeIds: params.generalTypeIds,
        recipeIds: params.recipeIds || [], // Default to an empty array if not provided
      },
    };
    const response = await updateMealApi(payload);
    
    if (response?.data?.updateMeal?.meal) {
      store.dispatch(setUpdateMeal(response));
      toast.success('Meal updated successfully');
      await onGetAllMeals();
    }
  } catch (error) {
    toast.error('Failed to update meal');
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const onDeleteMeal = async (id: string) => {
  try {
    store.dispatch(setLoading(true));
    const response = await deleteMealApi(id);
    store.dispatch(setDeleteMeal({ id, data: response?.data }));
    if (response?.data?.deleteMeal?.success) {
      toast.success('Meal deleted successfully');
    }
  } catch (error) {
    toast.error('Failed to delete meal');
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Add new action type
export const FILTER_MEALS = 'FILTER_MEALS';

// Add filter interface
interface FilterParams {
  search?: string;
  categories?: string[];
  mealTypes?: string[];
  ingredients?: string[];
}

// Add filter action
export const onFilterMeals = async (filters: FilterParams) => {
  try {
    store.dispatch(setLoading(true));
    
    const queryParams = new URLSearchParams();
    
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    
    if (filters.categories?.length) {
      filters.categories.forEach(cat => queryParams.append('categories', cat));
    }
    
    if (filters.mealTypes?.length) {
      filters.mealTypes.forEach(type => queryParams.append('mealTypes', type));
    }
    
    if (filters.ingredients?.length) {
      filters.ingredients.forEach(ing => queryParams.append('ingredients', ing));
    }

    const response = await fetch(`/api/meals/filter?${queryParams.toString()}`);
    const data = await response.json();
    
    store.dispatch(filterMeals(data));
  } catch (error) {
    toast.error('Failed to filter meals');
  } finally {
    store.dispatch(setLoading(false));
  }
};