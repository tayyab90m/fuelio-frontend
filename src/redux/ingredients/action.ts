import { 
  createIngredient,
  getAllIngredients,
  deleteIngredient,
  updateIngredient as updateIngredientApi,
  getIngredient
} from "../../apiServices/endpoints/ingredients";
import { 
  CreateIngredientVariable, 
  UpdateIngredientVariable 
} from "../../apiServices/endpoints/ingredients/types";
import { store } from "../store";
import { 
  addIngredient, 
  setIngredients, 
  removeIngredient, 
  updateIngredient, 
  setCurrentIngredient 
} from "./reducer";

export const onCreateIngredient = async (props: CreateIngredientVariable): Promise<boolean> => {
    try {
        const response = await createIngredient(props);
        if (!response?.data?.createIngredient?.ingredient) return false;
        store.dispatch(addIngredient(response.data.createIngredient.ingredient));
        return true;
    } catch (error) {
        return false;
    }
}

export const onGetIngredients = async (): Promise<void> => {
    try {
        const response = await getAllIngredients();
        if (response?.data?.allIngredients) {
            store.dispatch(setIngredients(response.data.allIngredients));
        }
    } catch (error) {
    }
}

export const onDeleteIngredient = async (id: string): Promise<boolean> => {
    try {
        const response = await deleteIngredient(id);
        if (response?.data?.deleteIngredient?.success) {
            store.dispatch(removeIngredient(id));
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

export const onGetIngredient = async (id: string): Promise<void> => {
    try {
        const response = await getIngredient(id);
        if (response.getIngredient) {
            store.dispatch(setCurrentIngredient(response.getIngredient));
        }
    } catch (error) {
    }
}

export const onUpdateIngredient = async (props: UpdateIngredientVariable): Promise<boolean> => {
    try {
        const response = await updateIngredientApi(props);
        if (!response?.data?.updateIngredient?.ingredient) return false;
        store.dispatch(updateIngredient(response.data.updateIngredient.ingredient));
        return true;
    } catch (error) {
        return false;
    }
}