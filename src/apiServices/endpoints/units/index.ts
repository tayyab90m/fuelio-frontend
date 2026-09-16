import { apiDelete, apiGet, apiPost, apiPut } from '../../methods';
import {
  CreateUnitResponse,
  CreateUnitVariable,
  DeleteUnitResponse,
  GetAllUnitsResponse,
  RestUnit,
  Unit,
  UpdateUnitResponse,
  UpdateUnitVariable,
} from './type';

const toUnit = (record: RestUnit): Unit => ({ id: record.id, name: record.name });

export const getAllUnits = async (): Promise<GetAllUnitsResponse> => {
  const { data } = await apiGet<{ data: RestUnit[] }>({ path: '/units' });
  return { data: { allUnits: data.map(toUnit) } };
};

export const createUnit = async (variables: CreateUnitVariable): Promise<CreateUnitResponse> => {
  const { data } = await apiPost<{ data: RestUnit }>({ path: '/units', body: { name: variables.name } });
  return { data: { createUnit: { unit: toUnit(data), success: true, errors: [] } } };
};

export const updateUnit = async (variables: UpdateUnitVariable): Promise<UpdateUnitResponse> => {
  const { data } = await apiPut<{ data: RestUnit }>({
    path: `/units/${variables.id}`,
    body: { name: variables.name },
  });
  return { data: { updateUnit: { unit: toUnit(data), errors: [] } } };
};

export const deleteUnit = async (id: string): Promise<DeleteUnitResponse> => {
  await apiDelete({ path: `/units/${id}` });
  return { data: { deleteUnit: { success: true, errors: [] } } };
};
