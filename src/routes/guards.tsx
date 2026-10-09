import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store';
import { onRefreshProfile } from '../redux/user/action';
import { Role, effectiveRole, homePathFor } from '../utils/roles';
import Loader from '../components/loader';

// Requires a signed-in user. On load it re-reads the profile so the role the
// UI acts on is current; until then (only when the saved session has no role)
// it shows a loader instead of flashing the wrong navigation.
export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData } = useSelector((state: RootState) => state.userReducer);
  const signedIn = Boolean(userData?.user?.id);
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    onRefreshProfile().then(() => {
      if (!cancelled) setProfileChecked(true);
    });
    return () => {
      cancelled = true;
    };
    // Re-check when the signed-in account changes, not on every token refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.user?.id]);

  if (!signedIn) return <Navigate to="/login" />;
  if (!userData.user?.role && !profileChecked) return <Loader />;
  return <>{children}</>;
};

// Layout route: renders its children only for the allowed roles; anyone else
// is sent to their own home page.
export const RequireRole: React.FC<{ roles: Role[] }> = ({ roles }) => {
  const { userData } = useSelector((state: RootState) => state.userReducer);
  const role = effectiveRole(userData?.user?.role);
  if (!roles.includes(role)) return <Navigate to={homePathFor(role)} replace />;
  return <Outlet />;
};

// Already signed in? Skip the login/register screens.
export const RedirectIfSignedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData } = useSelector((state: RootState) => state.userReducer);
  if (userData?.user?.id) return <Navigate to={homePathFor(userData.user.role)} replace />;
  return <>{children}</>;
};
