import { AxiosResponse } from "axios";
import { handleError } from "../errorHandling";

export const requestHandler = async <T>(
    request: () => Promise<AxiosResponse<T>>): Promise<T> => {
    try {
        const response = await request();
        return response.data;
    } catch (error) {
        handleError(error);
        throw error; // Re-throw error for calling code to handle if needed
    }
};
