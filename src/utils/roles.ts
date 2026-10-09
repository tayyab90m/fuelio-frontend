import { UserObj } from '../interfaces/user/types';

export type Role = NonNullable<UserObj['role']>;

export const STAFF_ROLES: Role[] = ['admin', 'coach'];

// Anything unknown (e.g. a session saved before roles existed) is treated as
// a client: least privilege. The backend enforces permissions regardless;
// this only decides what the UI shows.
export const effectiveRole = (role?: string): Role =>
  role === 'admin' || role === 'coach' ? role : 'client';

export const isStaff = (role?: string): boolean => STAFF_ROLES.includes(effectiveRole(role));
export const isAdmin = (role?: string): boolean => effectiveRole(role) === 'admin';

/** Where each role lands after signing in. */
export const homePathFor = (role?: string): string =>
  isStaff(role) ? '/dashboard/coach-dashboard' : '/dashboard/meal-generator';
