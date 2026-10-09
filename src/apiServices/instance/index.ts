import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { store } from "../../redux/store";
import { tokenExpireCase } from "../statusCode";
import { setUserData } from "../../redux/user/reducer";
import { refreshApi } from "../endpoints/authentication";

export const BASE_URL = process.env.REACT_APP_API_URL as string;

// Several requests often fail with 401 at the same moment (a screen loading
// 3 lists on mount). The backend rotates the refresh token on every use, so
// they must share ONE refresh call: a second, concurrent call can be rejected
// once the first has rotated the token, which would sign the user out.
let refreshInFlight: Promise<string | null> | null = null;

const refreshSession = (): Promise<string | null> => {
  if (!refreshInFlight) {
    const { refreshToken, user } = store.getState().userReducer?.userData || {};
    refreshInFlight = refreshApi({ refresh_token: refreshToken as string })
      .then((response) => {
        const refreshed = response?.data?.refreshUserToken;
        if (!refreshed?.token) return null;
        store.dispatch(
          setUserData({
            ...store.getState().userReducer?.userData,
            ...refreshed,
            // The refresh endpoint doesn't return the user object - keep the
            // one already in the store.
            user: refreshed.user || user,
          })
        );
        return refreshed.token;
      })
      .catch(() => null)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

const createInstance = (config: AxiosRequestConfig = {}): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      // 'ngrok-skip-browser-warning': 'true',
      ...config.headers,
    },
    ...config,
  });

  instance.interceptors.request.use(
    (request) => {
      const { token } = store.getState().userReducer?.userData || {};
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { token, refreshToken } = store.getState().userReducer?.userData || {};
      const originalRequest = error.config;
      // A 401 from login/register means bad credentials, not an expired
      // token - never try to refresh (or end) a session for those.
      const isSessionExpiry =
        error.response?.status === tokenExpireCase &&
        !originalRequest?.url?.includes("/auth/");
      if (
        isSessionExpiry &&
        token &&
        refreshToken &&
        !originalRequest?._retriedAfterRefresh
      ) {
        const newToken = await refreshSession();
        if (newToken) {
          originalRequest._retriedAfterRefresh = true;
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return instance(originalRequest);
        }
      }
      // Still unauthorized after a refresh attempt (or nothing to refresh
      // with): the session is dead. Clear it the same way LogOut does, so
      // AuthWrapper sends the user back to /login instead of leaving them on
      // a page where every request fails.
      if (isSessionExpiry && token) {
        store.dispatch({ type: "userLogout" });
        // toastId de-dupes when several requests fail at the same moment.
        toast.info("Your session has expired. Please sign in again.", { toastId: "session-expired" });
      }
      // No toast here: requestHandler (every API helper goes through it)
      // already reports the rejected error once.
      return Promise.reject(error);
    }
  );

  return instance;
};

export const instance = createInstance();
export const instanceForRefreshToken = () => {
  return axios.create({
    baseURL: BASE_URL,
  });
};
