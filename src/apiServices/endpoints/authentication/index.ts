import { apiPost, apiPostForRefreshToken } from "../../methods";
import {
  loginApiBodyParams,
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
