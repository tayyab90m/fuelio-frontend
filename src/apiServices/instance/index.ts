import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { handleError } from "../errorHandling";
import { store } from "../../redux/store";
import { tokenExpireCase } from "../statusCode";
import { setUserData } from "../../redux/user/reducer";
import { refreshApi } from "../endpoints/authentication";

export const BASE_URL = process.env.REACT_APP_API_URL as string;

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
      const { token, refreshToken, user } = store.getState().userReducer?.userData || {};
      const originalRequest = error.config;
      if (
        token &&
        refreshToken &&
        error.response &&
        error.response.status == tokenExpireCase &&
        !originalRequest?._retriedAfterRefresh
      ) {
        try {
          const response = await refreshApi({ refresh_token: refreshToken });
          const refreshed = response?.data?.refreshUserToken;
          if (refreshed?.token) {
            originalRequest._retriedAfterRefresh = true;
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${refreshed.token}`,
            };
            store.dispatch(
              setUserData({
                ...store.getState().userReducer?.userData,
                ...refreshed,
                // The refresh endpoint doesn't return the user object -
                // keep the one already in the store.
                user: refreshed.user || user,
              })
            );
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed (expired/invalid refresh token) - fall through
          // to the normal error handling below.
        }
      }
      handleError(error);
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
