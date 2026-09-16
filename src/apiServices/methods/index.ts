import { instance, instanceForRefreshToken } from "../instance";
import { requestHandler } from "../requestHandler";
import { BodyRequestParams, RequestParams } from "./types";

// All REST routes on the new backend live under this versioned prefix
// (see fitness-dashboard-backend/src/app.ts -> API_PREFIX).
const API_PREFIX = "/api/v1";

const buildUrl = (path: string): string =>
    `${API_PREFIX}${path.startsWith("/") ? path : `/${path}`}`;

export const apiGet = async <T>({ path, params, config }: RequestParams): Promise<T> => {
    return requestHandler(() =>
        instance.get<T>(buildUrl(path), { params, ...config })
    );
};

export const apiPost = async <T>({ path, body, config }: BodyRequestParams): Promise<T> => {
    return requestHandler(() =>
        instance.post<T>(buildUrl(path), body, { ...config })
    );
};

export const apiPut = async <T>({ path, body, config }: BodyRequestParams): Promise<T> => {
    return requestHandler(() =>
        instance.put<T>(buildUrl(path), body, { ...config })
    );
};

export const apiPatch = async <T>({ path, body, config }: BodyRequestParams): Promise<T> => {
    return requestHandler(() =>
        instance.patch<T>(buildUrl(path), body, { ...config })
    );
};

export const apiDelete = async <T>({ path, config }: RequestParams): Promise<T> => {
    return requestHandler(() =>
        instance.delete<T>(buildUrl(path), { ...config })
    );
};

// Used only for POST /auth/refresh: must go through an axios instance that
// has no auth/response interceptors (avoids infinite refresh loops).
export const apiPostForRefreshToken = async <T>({ path, body, config }: BodyRequestParams): Promise<T> => {
    return requestHandler(() =>
        instanceForRefreshToken().post<T>(buildUrl(path), body, { ...config })
    );
};
