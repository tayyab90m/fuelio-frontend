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
    } finally {
    }
}

export const onUpdateMealType = async (props: UpdateGeneralMealTypeBodyParams, { setSubmitting }: FormikHelpers<UpdateGeneralMealTypeBodyParams>) => {
    try {
        setSubmitting(true);
        const response = await updateGeneralMealsApi(props);
    } finally {
        setSubmitting(false);
    }
}

export const onGetAllUnits = async () => {
    try {
        store.dispatch(setIsLoading(true));
        const response = await getAllUnitsApi();
        store.dispatch(setAllMealUnits(response.data.allUnits));
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
    } finally {
        store.dispatch(setIsLoading(false));
    }
}