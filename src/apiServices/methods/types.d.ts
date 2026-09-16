import { AxiosRequestConfig } from "axios";

/**
 * Centralized REST request params.
 * @param path - API path relative to BASE_URL/api/v1 (e.g. "/goals" or "/goals/123").
 * @param body - Request body for POST/PUT (optional).
 * @param params - Query string parameters for GET (optional).
 * @param config - Additional Axios configuration (optional).
 */
export interface RequestParams {
    path: string;
    params?: Record<string, unknown>;
    config?: AxiosRequestConfig;
}

export interface BodyRequestParams {
    path: string;
    body?: Record<string, unknown> | unknown[];
    config?: AxiosRequestConfig;
}
