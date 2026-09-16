import { 
  getAllCuisinesApi, 
  createCuisineApi, 
  deleteCuisineApi, 
  updateCuisineApi 
} from "../../apiServices/endpoints/cuisine";
import { setIsLoading } from "../meals/reducer";
import { store } from "../store";
import { 
  setAllCuisines, 
  addCuisine, 
  deleteCuisine, 
  updateCuisine 
} from "./reducer";
import { toast } from "react-toastify";

const handleError = (message: string) => {
  toast.error(message);
  store.dispatch(setIsLoading(false));
};

export const onGetAllCuisines = async () => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await getAllCuisinesApi();
    store.dispatch(setAllCuisines(response?.data?.allCuisines || []));
  } catch {
    handleError('Failed to fetch cuisines');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onCreateCuisine = async (name: string, state?: string) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await createCuisineApi({ name, state: state as 'published' | 'unpublished' });
    
    if (response?.data?.createCuisine?.cuisine) {
      store.dispatch(addCuisine(response.data.createCuisine.cuisine));
      toast.success('Cuisine created successfully!');
    } else if (response?.data?.createCuisine?.errors) {
      toast.error(response.data.createCuisine.errors[0]);
    }
  } catch {
    handleError('Failed to create cuisine');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onDeleteCuisine = async (id: string) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await deleteCuisineApi(id);
    
    if (response?.data?.deleteCuisine?.success) {
      store.dispatch(deleteCuisine(id));
      toast.success('Cuisine deleted successfully!');
    } else if (response?.data?.deleteCuisine?.errors) {
      toast.error(response.data.deleteCuisine.errors[0]);
    }
  } catch {
    handleError('Failed to delete cuisine');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onUpdateCuisine = async (id: string, name?: string, state?: string) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await updateCuisineApi(id, name, state);
    
    if (response?.data?.updateCuisine?.cuisine) {
      store.dispatch(updateCuisine(response.data.updateCuisine.cuisine));
      toast.success('Cuisine updated successfully!');
    } else if (response?.data?.updateCuisine?.errors) {
      toast.error(response.data.updateCuisine.errors[0]);
    }
  } catch {
    handleError('Failed to update cuisine');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onToggleCuisineState = async (id: string, currentState: string) => {
  try {
    store.dispatch(setIsLoading(true));
    const newState = currentState === 'published' ? 'unpublished' : 'published';
    const response = await updateCuisineApi(id, undefined, newState);
    
    if (response?.data?.updateCuisine?.cuisine) {
      store.dispatch(updateCuisine(response.data.updateCuisine.cuisine));
      toast.success(`Cuisine ${newState} successfully!`);
    } else if (response?.data?.updateCuisine?.errors) {
      toast.error(response.data.updateCuisine.errors[0]);
    }
  } catch {
    handleError('Failed to update cuisine state');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};
