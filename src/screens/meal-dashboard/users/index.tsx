import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Plus, Trash } from 'lucide-react';
import { RootState } from '../../../redux/store';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { createUserApi, deleteUserApi, listUsersApi, updateUserRoleApi } from '../../../apiServices/endpoints/users';
import { ManagedUser, UsersPage } from '../../../apiServices/endpoints/users/types';

const ROLES: ManagedUser['role'][] = ['admin', 'coach', 'client'];
const PAGE_SIZE = 10;

const createSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(8, 'Use at least 8 characters').required('Password is required'),
  role: Yup.string().oneOf(ROLES).required(),
});

const inputClass = 'h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200';
const headerClass = 'px-6 py-5 text-white text-left text-base font-semibold uppercase';
const cellClass = 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900';

const Users = () => {
  const currentUserId = useSelector((state: RootState) => state.userReducer.userData?.user?.id);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<ManagedUser['role'] | ''>('');
  const [result, setResult] = useState<UsersPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // Wait for a pause in typing before querying.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setResult(await listUsersApi({ page, limit: PAGE_SIZE, search, role: roleFilter || undefined }));
    } catch {
      // Reported by the request layer's error toast.
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRoleChange = async (user: ManagedUser, role: ManagedUser['role']) => {
    if (role === user.role) return;
    if (!window.confirm(`Change ${user.name} from ${user.role} to ${role}? They will be signed out within a few minutes.`)) {
      return;
    }
    try {
      await updateUserRoleApi(user.id, role);
      toast.success(`${user.name} is now ${role}`);
    } catch {
      // Error toast shown (e.g. "There must always be at least one admin").
    }
    await load();
  };

  const handleDelete = async (user: ManagedUser) => {
    if (!window.confirm(`Delete ${user.name} (${user.email})? Their saved plans are deleted too.`)) return;
    try {
      await deleteUserApi(user.id);
      toast.success('User deleted successfully');
      // Step back a page if that was the last row on it.
      if (result && result.data.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch {
      // Error toast shown by the request layer.
    }
  };

  const users = result?.data ?? [];
  const meta = result?.meta;

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <Button
          size="sm"
          className="bg-primary gap-2 font-bold text-sm text-white hover:bg-primary/80"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="search"
          aria-label="Search users"
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={`${inputClass} max-w-xs bg-white`}
        />
        <select
          aria-label="Filter by role"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as ManagedUser['role'] | '');
            setPage(1);
          }}
          className={`${inputClass} max-w-[10rem] bg-white capitalize`}
        >
          <option value="">All roles</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-y-auto mt-4 bg-white rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-secondary">
            <tr>
              <th className={headerClass}>Name</th>
              <th className={headerClass}>Email</th>
              <th className={headerClass}>Role</th>
              <th className={`${headerClass} text-center`}>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => {
                const isSelf = user.id === currentUserId;
                return (
                  <tr className="hover:bg-gray-50" key={user.id}>
                    <td className={cellClass}>
                      {user.name}
                      {isSelf && <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">You</span>}
                    </td>
                    <td className={cellClass}>{user.email}</td>
                    <td className={cellClass}>
                      <select
                        aria-label={`Role for ${user.name}`}
                        value={user.role}
                        disabled={isSelf}
                        title={isSelf ? "You can't change your own role" : undefined}
                        onChange={(e) => handleRoleChange(user, e.target.value as ManagedUser['role'])}
                        className="h-9 rounded-md border border-gray-200 px-2 capitalize disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isSelf}
                          className="bg-primary font-bold text-sm hover:bg-primary/80 text-white disabled:opacity-40"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                  {loading ? 'Loading...' : 'No users found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {meta.page} of {meta.totalPages} · {meta.total} users
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-white sm:max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-800">Add User</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{ name: '', email: '', password: '', role: 'coach' as ManagedUser['role'] }}
            validationSchema={createSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await createUserApi({ ...values, name: values.name.trim() });
                toast.success('User created successfully');
                setShowCreate(false);
                await load();
              } catch {
                // Error toast shown (e.g. email already in use); keep the dialog open.
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4 pt-4" noValidate>
                {(['name', 'email', 'password'] as const).map((field) => (
                  <div className="space-y-2" key={field}>
                    <label htmlFor={`user-${field}`} className="text-sm font-medium text-gray-700 capitalize">
                      {field}
                    </label>
                    <Field
                      id={`user-${field}`}
                      name={field}
                      type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                      autoComplete={field === 'password' ? 'new-password' : 'off'}
                      className={inputClass}
                    />
                    {errors[field] && touched[field] && <div className="text-sm text-red-500">{errors[field]}</div>}
                  </div>
                ))}
                <div className="space-y-2">
                  <label htmlFor="user-role" className="text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <Field as="select" id="user-role" name="role" className={`${inputClass} capitalize`}>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Field>
                </div>
                <DialogFooter className="pt-6 border-t gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowCreate(false)} className="border-gray-200 hover:bg-gray-50 text-gray-700">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                    {isSubmitting ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
