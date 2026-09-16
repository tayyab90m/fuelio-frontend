import { store } from "../store";
import { setIsLoading } from "../meals/reducer";
import { allActivityLevelsApi, createActivityLevelApi, deleteActivityLevelApi, updateActivityLevelApi } from "../../apiServices/endpoints/activity";
import { setAllActivityLevels, setCreateActivityLevel, updateActivityLevel, deleteActivityLevel } from "./reducer";
import { ActivityLevel, CreateActivityLevelInput, UpdateActivityLevelInput, ActivityLevelResponse } from "../../apiServices/endpoints/activity/type";
import { toast } from "react-toastify";

// Add type for the response
interface ApiResponse {
  data?: {
    allActivityLevels?: ActivityLevel[];
    createActivityLevel?: ActivityLevelResponse;
    updateActivityLevel?: ActivityLevelResponse;
    deleteActivityLevel?: { success: boolean; errors?: string[] };
    destroyActivityLevel?: { success: boolean; errors?: string[] };
  };
}

export const onGetAllActivityLevels = async () => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await allActivityLevelsApi();
    store.dispatch(setAllActivityLevels(response?.data?.allActivityLevels));
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onCreateActivityLevel = async (input: CreateActivityLevelInput) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await createActivityLevelApi(input);
    if (response?.data?.createActivityLevel) {
      store.dispatch(setCreateActivityLevel(response.data.createActivityLevel));
      if (response.data.createActivityLevel) {
        toast.success('Activity level created successfully!');
      }
    }
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onUpdateActivityLevel = async (input: UpdateActivityLevelInput) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await updateActivityLevelApi(input);

    if (response?.data?.updateActivityLevel?.activityLevel) {
      store.dispatch(updateActivityLevel(response.data.updateActivityLevel.activityLevel));
      toast.success('Activity level updated successfully!');
    } else if (response?.data?.updateActivityLevel?.errors) {
      toast.error(response.data.updateActivityLevel.errors[0]);
    }
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onDeleteActivityLevel = async (id: string) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await deleteActivityLevelApi(id) as ApiResponse;
    if (response?.data?.destroyActivityLevel?.success) {
      store.dispatch(deleteActivityLevel(id));
      toast.success('Activity level deleted successfully!');
      return response;
    }
  } finally {
    store.dispatch(setIsLoading(false));
  }
  return null;
};
