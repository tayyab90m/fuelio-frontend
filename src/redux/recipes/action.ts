import { store } from "../store";
import { setIsLoading } from "../meals/reducer";
import { 
  setAllRecipes, 
  addRecipe, 
  updateRecipe, 
  deleteRecipe, 
  setRecipeError 
} from "./reducer";
import { 
  allRecipesApi, 
  createRecipeApi, 
  updateRecipeApi, 
  deleteRecipeApi 
} from "../../apiServices/endpoints/recipes";
import { CreateRecipeVariables, Recipe, CreateRecipeInput, UpdateRecipeInput } from "../../apiServices/endpoints/recipes/types";
import { toast } from "react-toastify";

const handleError = (message: string) => {
  toast.error(message);
  store.dispatch(setRecipeError(message));
  store.dispatch(setIsLoading(false));
};

export const onGetAllRecipes = async () => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await allRecipesApi();
    if (response?.data?.allRecipes) {
      store.dispatch(setAllRecipes(response.data.allRecipes));
    }
  } catch (error) {
    handleError('Failed to fetch recipes');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onCreateRecipe = async (input: CreateRecipeInput) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await createRecipeApi(input);
    
    if (response?.data?.createRecipe?.recipe) {
      store.dispatch(addRecipe(response.data.createRecipe.recipe));
      toast.success('Recipe created successfully!');
    } else if (response?.data?.createRecipe?.errors) {
      handleError(response.data.createRecipe.errors[0]);
    }
  } catch (error) {
    handleError('Failed to create recipe');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onUpdateRecipe = async (input: UpdateRecipeInput) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await updateRecipeApi(input);
    if (response?.data?.updateRecipe?.recipe) {
      // store.dispatch(updateRecipe(response.data.updateRecipe.recipe));
      onGetAllRecipes()
      toast.success('Recipe updated successfully!');
    } else if (response?.data?.updateRecipe?.errors) {
      handleError(response.data.updateRecipe.errors[0]);
    }
  } catch {
    handleError('Failed to update recipe');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onDeleteRecipe = async (id: string) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await deleteRecipeApi(id);
    
    if (response?.data?.deleteRecipe?.success) {
      store.dispatch(deleteRecipe(id));
      toast.success('Recipe deleted successfully!');
    } else if (response?.data?.deleteRecipe?.errors) {
      handleError(response.data.deleteRecipe.errors[0]);
    }
  } catch {
    handleError('Failed to delete recipe');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};