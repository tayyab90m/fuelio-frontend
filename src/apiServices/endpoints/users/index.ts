import { apiDelete, apiGet, apiPatch, apiPost } from '../../methods';
import { CreateUserBody, ListUsersParams, ManagedUser, UsersPage } from './types';

// Admin-only endpoints (GET/POST /users, PATCH/DELETE /users/:id).
export const listUsersApi = (params: ListUsersParams): Promise<UsersPage> =>
  apiGet<UsersPage>({
    path: '/users',
    // Blank filters would be rejected by the backend's validation; omit them.
    params: { ...params, search: params.search || undefined, role: params.role || undefined },
  });

export const createUserApi = async (body: CreateUserBody): Promise<ManagedUser> => {
  const { data } = await apiPost<{ data: ManagedUser }>({ path: '/users', body: { ...body } });
  return data;
};

export const updateUserRoleApi = async (id: string, role: ManagedUser['role']): Promise<ManagedUser> => {
  const { data } = await apiPatch<{ data: ManagedUser }>({ path: `/users/${id}`, body: { role } });
  return data;
};

export const deleteUserApi = async (id: string): Promise<void> => {
  await apiDelete({ path: `/users/${id}` });
};
