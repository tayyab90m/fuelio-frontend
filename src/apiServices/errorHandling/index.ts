import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { errorCase, tokenExpireCase } from '../statusCode';

// The REST backend's global error handler always responds with
// { error: { message, statusCode, details? } } (see
// fitness-dashboard-backend/src/plugins/errorHandler.ts).
export const handleError = (error: AxiosError | any) => {
    // A 401 outside login/register means the session ended. The axios
    // interceptor either refreshes and retries, or signs the user out and
    // shows one "session expired" message, so don't add raw 401 toasts too.
    const url: string = error?.config?.url || '';
    const isLoginAttempt = url.includes('/auth/login') || url.includes('/auth/register');
    if (error?.response?.status === tokenExpireCase && !isLoginAttempt) {
        return errorCase;
    }
    const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
    toast.error(message);
    return errorCase;
};
