import { UserObj, UserAuthState } from "../../../interfaces/user/types";

export interface loginApiBodyParams {
    email: string;
    password: string;

}
export interface loginApiResponseParams {
    data: {
        login: UserAuthState
    }
}
export interface RefreshTokenApiRequestParams {
    refresh_token: string;
}
export interface RefreshTokenApiResponse {
    data: {
        refreshUserToken: UserAuthState
    };
}

// Raw shapes returned by the REST backend (POST /auth/login, POST /auth/refresh)
// before normalization into the loginApiResponseParams / RefreshTokenApiResponse
// envelopes above, which keep the redux layer (src/redux/user) unchanged.
export interface RestAuthTokenResponse {
    user: UserObj;
    accessToken: string;
    refreshToken: string;
}
export interface RestRefreshResponse {
    accessToken: string;
    refreshToken: string;
}
