import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "../../methods";
import {
  CreateCuisineMutationResponse,
  CreateCuisineVariables,
  Cuisine,
  DeleteCuisineMutationResponse,
  GetAllCuisinesQueryResponse,
  RestCuisine,
  UpdateCuisineStateMutationResponse,
} from "./types";

const stateToRest = (state?: Cuisine['state']): 'active' | 'inactive' | undefined => {
  if (state === undefined) return undefined;
  return state === 'unpublished' ? 'inactive' : 'active';
};

const stateFromRest = (state: RestCuisine['state']): Cuisine['state'] =>
  state === 'active' ? 'published' : 'unpublished';

const toCuisine = (record: RestCuisine): Cuisine => ({
  id: record.id,
  name: record.name,
  state: stateFromRest(record.state),
});

// API call to fetch all cuisines
export const getAllCuisinesApi = async (): Promise<GetAllCuisinesQueryResponse> => {
  const { data } = await apiGet<{ data: RestCuisine[] }>({ path: "/cuisines" });
  return { data: { allCuisines: data.map(toCuisine) } };
};

// API call to create a new cuisine
export const createCuisineApi = async (
  variables: CreateCuisineVariables
): Promise<CreateCuisineMutationResponse> => {
  const { data } = await apiPost<{ data: RestCuisine }>({
    path: "/cuisines",
    body: { name: variables.name, state: stateToRest(variables.state) },
  });
  return { data: { createCuisine: { cuisine: toCuisine(data), errors: [] } } };
};

// API call to delete a cuisine by ID
export const deleteCuisineApi = async (
  id: string
): Promise<DeleteCuisineMutationResponse> => {
  await apiDelete({ path: `/cuisines/${id}` });
  return { data: { deleteCuisine: { success: true, errors: [] } } };
};

// API call to update a cuisine (partial update - only name/state if given)
export const updateCuisineApi = async (
  id: string,
  name?: string,
  state?: string
): Promise<UpdateCuisineStateMutationResponse> => {
  const body: { name?: string; state?: 'active' | 'inactive' } = {};
  if (name !== undefined) body.name = name;
  if (state !== undefined) body.state = stateToRest(state as Cuisine['state']);
  const { data } = await apiPut<{ data: RestCuisine }>({ path: `/cuisines/${id}`, body });
  return { data: { updateCuisine: { cuisine: toCuisine(data), errors: [] } } };
};

// API call to toggle the state of a cuisine (published/unpublished) using
// the backend's dedicated PATCH /cuisines/:id/toggle-state route, which
// flips active/inactive server-side.
export const toggleCuisineStateApi = async (
  id: string,
  _state: 'published' | 'unpublished'
): Promise<UpdateCuisineStateMutationResponse> => {
  const { data } = await apiPatch<{ data: RestCuisine }>({ path: `/cuisines/${id}/toggle-state` });
  return { data: { updateCuisine: { cuisine: toCuisine(data), errors: [] } } };
};
