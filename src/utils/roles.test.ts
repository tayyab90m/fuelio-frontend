import { effectiveRole, homePathFor, isAdmin, isStaff } from './roles';

describe('roles', () => {
  it('treats unknown or missing roles as client (least privilege)', () => {
    expect(effectiveRole(undefined)).toBe('client');
    expect(effectiveRole('')).toBe('client');
    expect(effectiveRole('superuser')).toBe('client');
  });

  it('recognises staff and admin', () => {
    expect(isStaff('admin')).toBe(true);
    expect(isStaff('coach')).toBe(true);
    expect(isStaff('client')).toBe(false);
    expect(isStaff(undefined)).toBe(false);
    expect(isAdmin('admin')).toBe(true);
    expect(isAdmin('coach')).toBe(false);
  });

  it('sends staff to the coach dashboard and everyone else to the plan generator', () => {
    expect(homePathFor('admin')).toBe('/dashboard/coach-dashboard');
    expect(homePathFor('coach')).toBe('/dashboard/coach-dashboard');
    expect(homePathFor('client')).toBe('/dashboard/meal-generator');
    expect(homePathFor(undefined)).toBe('/dashboard/meal-generator');
  });
});
