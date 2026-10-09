import { apiDelete, apiGet, apiPatch, apiPost } from '../../methods';
import { SavedPlan, SavedPlanSummary } from './types';

// The backend keeps at most 50 plans per user, so one page of 100 holds them all.
export const listSavedPlansApi = async (): Promise<SavedPlanSummary[]> => {
  const { data } = await apiGet<{ data: SavedPlanSummary[] }>({ path: '/diet-plans', params: { limit: 100 } });
  return data;
};

export const getSavedPlanApi = async (id: string): Promise<SavedPlan> => {
  const { data } = await apiGet<{ data: SavedPlan }>({ path: `/diet-plans/${id}` });
  return data;
};

// The backend recalculates the plan from the answers (it never trusts a
// client-supplied result), so send the same answers the plan was generated from.
export const savePlanApi = async (answers: Record<string, unknown>, name?: string): Promise<SavedPlan> => {
  const { data } = await apiPost<{ data: SavedPlan }>({
    path: '/diet-plans',
    body: { ...answers, ...(name ? { name } : {}) },
  });
  return data;
};

export const renameSavedPlanApi = async (id: string, name: string): Promise<SavedPlan> => {
  const { data } = await apiPatch<{ data: SavedPlan }>({ path: `/diet-plans/${id}`, body: { name } });
  return data;
};

export const deleteSavedPlanApi = async (id: string): Promise<void> => {
  await apiDelete({ path: `/diet-plans/${id}` });
};
