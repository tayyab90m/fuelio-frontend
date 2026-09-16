import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { errorCase } from '../statusCode';

// The REST backend's global error handler always responds with
// { error: { message, statusCode, details? } } (see
// fitness-dashboard-backend/src/plugins/errorHandler.ts).
export const handleError = (error: AxiosError | any) => {
    const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
    toast.error(message);
    return errorCase;
};
