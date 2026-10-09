import { apiGet, apiPost, apiPostForRefreshToken } from "../../methods";
import { UserObj } from "../../../interfaces/user/types";
import {
  loginApiBodyParams,
  registerApiBodyParams,
  loginApiResponseParams,
  RefreshTokenApiRequestParams,
  RefreshTokenApiResponse,
  RestAuthTokenResponse,
  RestRefreshResponse,
} from "./types";

// REST backend: POST /api/v1/auth/login -> { user, accessToken, refreshToken }.
// Normalized here into the old { data: { login: UserAuthState } } envelope so
// src/redux/user/action.ts (onLogin) doesn't need to change.
export const loginApi = async (variables: loginApiBodyParams): Promise<loginApiResponseParams> => {
  const result = await apiPost<RestAuthTokenResponse>({
    path: "/auth/login",
    body: { email: variables.email, password: variables.password },
  });
  return {
    data: {
      login: {
        success: true,
        errors: [],
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
      },
    },
  };
};

// REST backend: POST /api/v1/auth/refresh -> { accessToken, refreshToken }.
// Uses instanceForRefreshToken (no auth/response interceptors) to avoid
// refresh-loop recursion, same as the old postRequestForRefreshToken.
export const refreshApi = async (
  variables: RefreshTokenApiRequestParams
): Promise<RefreshTokenApiResponse> => {
  const result = await apiPostForRefreshToken<RestRefreshResponse>({
    path: "/auth/refresh",
    body: { refreshToken: variables.refresh_token },
  });
  return {
    data: {
      refreshUserToken: {
        success: true,
        errors: [],
        token: result.accessToken,
        refreshToken: result.refreshToken,
      },
    },
  };
};

// POST /api/v1/auth/register always creates a "client" account.
export const registerApi = async (variables: registerApiBodyParams): Promise<loginApiResponseParams> => {
  const result = await apiPost<RestAuthTokenResponse>({
    path: "/auth/register",
    body: { name: variables.name, email: variables.email, password: variables.password },
  });
  return {
    data: {
      login: {
        success: true,
        errors: [],
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
      },
    },
  };
};

// GET /api/v1/auth/me -> the current user, including their up-to-date role.
export const meApi = async (): Promise<UserObj> => {
  const result = await apiGet<{ user: UserObj }>({ path: "/auth/me" });
  return result.user;
};
