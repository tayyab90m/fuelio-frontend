import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RedirectIfSignedIn, RequireRole } from './guards';

// guards.tsx imports the real session actions, which pull in the whole store
// and HTTP layer; none of that is needed to test the redirects.
jest.mock('../redux/user/action', () => ({ onRefreshProfile: jest.fn().mockResolvedValue(true) }));

const storeFor = (role?: string) =>
  configureStore({
    reducer: {
      userReducer: () => ({ userData: role === undefined ? {} : { user: { id: 'u1', role } } }),
    },
  });

const renderAt = (path: string, role: string | undefined, ui: React.ReactNode) =>
  render(
    <Provider store={storeFor(role)}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          {ui}
          <Route path="/dashboard/coach-dashboard" element={<p>coach home</p>} />
          <Route path="/dashboard/meal-generator" element={<p>client home</p>} />
          <Route path="/login" element={<p>login page</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

const guarded = (roles: Array<'admin' | 'coach' | 'client'>) => (
  <Route element={<RequireRole roles={roles} />}>
    <Route path="/secret" element={<p>secret content</p>} />
  </Route>
);

describe('RequireRole', () => {
  it('renders the page for an allowed role', () => {
    renderAt('/secret', 'coach', guarded(['admin', 'coach']));
    expect(screen.getByText('secret content')).toBeInTheDocument();
  });

  it('sends a client away from a staff page to their own home', () => {
    renderAt('/secret', 'client', guarded(['admin', 'coach']));
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
    expect(screen.getByText('client home')).toBeInTheDocument();
  });

  it('sends a coach away from an admin-only page to the coach dashboard', () => {
    renderAt('/secret', 'coach', guarded(['admin']));
    expect(screen.getByText('coach home')).toBeInTheDocument();
  });

  it('treats a session with no role as a client', () => {
    renderAt('/secret', 'unknown-role', guarded(['admin', 'coach']));
    expect(screen.getByText('client home')).toBeInTheDocument();
  });
});

describe('RedirectIfSignedIn', () => {
  const loginRoute = (
    <Route path="/login-form" element={<RedirectIfSignedIn><p>login form</p></RedirectIfSignedIn>} />
  );

  it('shows the form to a signed-out visitor', () => {
    renderAt('/login-form', undefined, loginRoute);
    expect(screen.getByText('login form')).toBeInTheDocument();
  });

  it('skips the form for a signed-in user and goes to their home', () => {
    renderAt('/login-form', 'admin', loginRoute);
    expect(screen.getByText('coach home')).toBeInTheDocument();
  });
});
