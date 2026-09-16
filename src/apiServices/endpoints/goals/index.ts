import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "../../methods";
import {
  AllGoalsResponse,
  CreateGoalResponse,
  CreateGoalVariables,
  DeleteGoalResponse,
  Goal,
  RestGoal,
  UpdateGoalResponse,
  UpdateGoalStateResponse,
} from "./types";

const calorieTypeToRest = (type: Goal['calorieAdjustment']['type']): RestGoal['calorieAdjustment']['type'] => {
  if (type === 'surplus') return 'increase';
  if (type === 'deficit') return 'decrease';
  return 'maintain';
};

const calorieTypeFromRest = (type: RestGoal['calorieAdjustment']['type']): Goal['calorieAdjustment']['type'] => {
  if (type === 'increase') return 'surplus';
  if (type === 'decrease') return 'deficit';
  return 'maintenance';
};

const stateToRest = (state?: Goal['state']): 'active' | 'inactive' =>
  state === 'unpublished' ? 'inactive' : 'active';

const stateFromRest = (state: RestGoal['state']): Goal['state'] =>
  state === 'active' ? 'published' : 'unpublished';

const toGoal = (record: RestGoal): Goal => ({
  id: record.id,
  name: record.name,
  description: record.description,
  calorieAdjustment: {
    type: calorieTypeFromRest(record.calorieAdjustment.type),
    percentage: record.calorieAdjustment.percentage,
  },
  macroRatios: record.macroRatios,
  state: stateFromRest(record.state),
});

const toRestBody = (goal: CreateGoalVariables | Goal) => ({
  name: goal.name,
  description: goal.description,
  calorieAdjustment: {
    type: calorieTypeToRest(goal.calorieAdjustment.type),
    percentage: goal.calorieAdjustment.percentage,
  },
  macroRatios: goal.macroRatios,
  state: stateToRest(goal.state),
});

export const allGoalsApi = async (): Promise<AllGoalsResponse> => {
  const { data } = await apiGet<{ data: RestGoal[] }>({ path: "/goals" });
  return { data: { allGoals: data.map(toGoal) } };
};

export const createGoalsApi = async (variables: CreateGoalVariables): Promise<CreateGoalResponse> => {
  const { data } = await apiPost<{ data: RestGoal }>({ path: "/goals", body: toRestBody(variables) });
  return { data: { createGoal: { goal: toGoal(data), errors: [] } } };
};

export const deleteGoalApi = async (id: string): Promise<DeleteGoalResponse> => {
  await apiDelete({ path: `/goals/${id}` });
  return { data: { deleteGoal: { success: true, errors: [] } } };
};

// Backend flips active/inactive itself (PATCH /goals/:id/toggle-state) - the
// `state` argument (desired next state) only exists for parity with the old
// GraphQL-era call signature and is not sent to the server.
export const toggleGoalStateApi = async (id: string, _state: string): Promise<UpdateGoalStateResponse> => {
  const { data } = await apiPatch<{ data: RestGoal }>({ path: `/goals/${id}/toggle-state` });
  return { data: { updateGoal: { goal: toGoal(data), errors: [] } } };
};

export const updateGoalApi = async (variables: Goal): Promise<UpdateGoalResponse> => {
  const { data } = await apiPut<{ data: RestGoal }>({
    path: `/goals/${variables.id}`,
    body: toRestBody(variables),
  });
  return { data: { updateGoal: { goal: toGoal(data), errors: [] } } };
};
