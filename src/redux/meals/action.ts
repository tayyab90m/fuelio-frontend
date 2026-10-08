import { FormikHelpers } from 'formik';
import { allGeneralMealsApi, createGeneralMealsApi, deleteGeneralMealsApi, getAllUnitsApi, updateGeneralMealsApi, updateMealTypeStateApi } from "../../apiServices/endpoints/meal";
import { store } from "../store";
import { addToAllGeneralTypes, removeToAllGeneralTypes, setAllMealUnits, setAllGeneralTypes, setIsLoading, updateMealTypeState } from "./reducer";
import { CreateGeneralMealTypeBodyParams, GetGeneralMealTypeBodyParams, UpdateGeneralMealTypeBodyParams } from '../../apiServices/endpoints/meal/types';

export const onMountAllMealTypes = async () => {
    try {
        store.dispatch(setIsLoading(true));
        const response = await allGeneralMealsApi();
        store.dispatch(setAllGeneralTypes(response.data.allGeneralTypes));
    } catch {
      // Already reported by the request layer's error toast; callers don't
      // await this, so rethrowing would only surface as an unhandled rejection.
    } finally {
        store.dispatch(setIsLoading(false));
    }
}

export const onCreateMealType = async (props: CreateGeneralMealTypeBodyParams, { setSubmitting }: FormikHelpers<CreateGeneralMealTypeBodyParams>) => {
    try {
        setSubmitting(true);
        const response = await createGeneralMealsApi(props);
        store.dispatch(addToAllGeneralTypes(response.data.generalType))
    } finally {
        setSubmitting(false);
    }
}
export const onDeleteMealType = async (props: GetGeneralMealTypeBodyParams) => {
    try {
        const response = await deleteGeneralMealsApi(props);
        if (response.data.deleteGeneralType.success) {
            store.dispatch(removeToAllGeneralTypes(props.id))
        }
    } catch {
      // Already reported by the request layer's error toast; callers don't
      // await this, so rethrowing would only surface as an unhandled rejection.
    }
}

export const onUpdateMealType = async (props: UpdateGeneralMealTypeBodyParams, { setSubmitting }: FormikHelpers<UpdateGeneralMealTypeBodyParams>) => {
    try {
        setSubmitting(true);
        await updateGeneralMealsApi(props);
    } finally {
        setSubmitting(false);
    }
}

export const onGetAllUnits = async () => {
    try {
        store.dispatch(setIsLoading(true));
        const response = await getAllUnitsApi();
        store.dispatch(setAllMealUnits(response.data.allUnits));
    } catch {
      // Already reported by the request layer's error toast; callers don't
      // await this, so rethrowing would only surface as an unhandled rejection.
    } finally {
        store.dispatch(setIsLoading(false));
    }
}

export const onUpdateMealTypeState = async (id: string, newState: string) => {
    try {
        store.dispatch(setIsLoading(true));
        const response = await updateMealTypeStateApi({ id, state: newState });
        if (!response.data.errors) {
            store.dispatch(updateMealTypeState({ id, state: newState }));
        }
    } catch {
      // Already reported by the request layer's error toast; callers don't
      // await this, so rethrowing would only surface as an unhandled rejection.
    } finally {
        store.dispatch(setIsLoading(false));
    }
}