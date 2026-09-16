import { allGoalsApi, createGoalsApi, deleteGoalApi, toggleGoalStateApi, updateGoalApi } from "../../apiServices/endpoints/goals";
import { setIsLoading } from "../meals/reducer";
import { store } from "../store";
import { setAllGoals, setCreateGoals, deleteGoal, updateGoalState } from "./reducer";
import { CreateGoalVariables, Goal } from "../../apiServices/endpoints/goals/types";
import { toast } from "react-toastify";

const handleError = (message: string) => {
  toast.error(message);
  store.dispatch(setIsLoading(false));
};

export const onGetAllGoals = async () => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await allGoalsApi();
    store.dispatch(setAllGoals(response?.data?.allGoals || []));
  } catch {
    handleError('Failed to fetch goals');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onCreateGoals = async (props: CreateGoalVariables) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await createGoalsApi(props);
    const createGoalResponse = {
      data: response?.data?.createGoal ? { createGoal: response.data.createGoal } : undefined,
    };
    store.dispatch(setCreateGoals(createGoalResponse));
    
    if (response?.data?.createGoal?.goal) {
      toast.success('Goal created successfully!');
    }
  } catch {
    handleError('Failed to create goal');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onDeleteGoal = async (id: string) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await deleteGoalApi(id);
    
    if (response?.data?.deleteGoal?.success) {
      store.dispatch(deleteGoal(id));
      toast.success('Goal deleted successfully!');
    } else if (response?.data?.deleteGoal?.errors) {
      toast.error(response.data.deleteGoal.errors[0]);
    }
  } catch {
    handleError('Failed to delete goal');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onToggleGoalState = async (id: string, currentState: string) => {
  try {
    store.dispatch(setIsLoading(true));
    const newState = currentState === 'published' ? 'unpublished' : 'published';
    const response = await toggleGoalStateApi(id, newState);
    
    if (response?.data?.updateGoal?.goal) {
      store.dispatch(updateGoalState(response.data.updateGoal.goal));
      toast.success(`Goal ${newState} successfully!`);
    } else if (response?.data?.updateGoal?.errors) {
      toast.error(response.data.updateGoal.errors[0]);
    }
  } catch {
    handleError('Failed to update goal state');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};

export const onUpdateGoal = async (goal: Goal) => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await updateGoalApi(goal);
    
    if (response?.data?.updateGoal?.goal) {
      store.dispatch(updateGoalState(response.data.updateGoal.goal));
      toast.success('Goal updated successfully!');
    } else if (response?.data?.updateGoal?.errors) {
      toast.error(response.data.updateGoal.errors[0]);
    }
  } catch {
    handleError('Failed to update goal');
  } finally {
    store.dispatch(setIsLoading(false));
  }
};