import { UserObj } from '../../../interfaces/user/types';

export type ManagedUser = Required<Pick<UserObj, 'id' | 'name' | 'email' | 'role'>> & {
  phoneNumber?: string | null;
};

export interface UsersPage {
  data: ManagedUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: ManagedUser['role'];
}

export interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  role: ManagedUser['role'];
}
