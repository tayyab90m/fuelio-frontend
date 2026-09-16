import { apiDelete, apiGet, apiPost, apiPut } from "../../methods";
import {
    AllGeneralMealTypesResponseProps,
    AllMealCategoryResponseProps,
    AllMealUnitResponseProps,
    CreateGeneralMealTypeBodyParams,
    DeleteGeneralMealCategoryResponseProps,
    DeleteGeneralMealTypeResponseProps,
    GeneralMealTypeResponseProps,
    GetGeneralMealTypeBodyParams,
    RestGeneralMealType,
    RestUnit,
    UpdateGeneralMealTypeBodyParams,
} from "./types";
import { MealTypesProps, MealUnitProps } from "../../../interfaces/meal/types";

const stateToRest = (state?: string): 'active' | 'inactive' | undefined => {
    if (state === undefined || state === '') return undefined;
    return state === 'unpublished' ? 'inactive' : 'active';
};

const stateFromRest = (state: RestGeneralMealType['state']): string =>
    state === 'active' ? 'published' : 'unpublished';

const toMealType = (record: RestGeneralMealType): MealTypesProps => ({
    id: record.id,
    name: record.name,
    code: '',
    description: record.description,
    state: stateFromRest(record.state),
    proteinPercentage: record.proteinPercentage,
    carbsPercentage: record.carbsPercentage,
    fatsPercentage: record.fatsPercentage,
    minimumProtein: record.minimumProtein,
    startTime: record.startTime,
    endTime: record.endTime,
});

const toUnit = (record: RestUnit): MealUnitProps => ({
    id: record.id,
    name: record.name,
    short: record.short || '',
    code: '',
    equivalentTo: record.equivalentTo != null ? String(record.equivalentTo) : '',
    unitType: record.unitType || '',
    system: record.system || '',
});

const toRestBody = (input: CreateGeneralMealTypeBodyParams | UpdateGeneralMealTypeBodyParams) => ({
    name: input.name,
    description: input.description,
    state: stateToRest(input.state),
    proteinPercentage: input.proteinPercentage,
    carbsPercentage: input.carbsPercentage,
    fatsPercentage: input.fatsPercentage,
    minimumProtein: input.minimumProtein,
    startTime: input.startTime,
    endTime: input.endTime,
});

export const allGeneralMealsApi = async (): Promise<AllGeneralMealTypesResponseProps> => {
    const { data } = await apiGet<{ data: RestGeneralMealType[] }>({ path: "/general-meal-types" });
    return { data: { allGeneralTypes: data.map(toMealType) } };
};

// The old GraphQL `allUnits` query lived alongside meal types; kept here
// (re-exported from ../units where possible) for signature compatibility.
export const getAllUnitsApi = async (): Promise<AllMealUnitResponseProps> => {
    const { data } = await apiGet<{ data: RestUnit[] }>({ path: "/units" });
    return { data: { allUnits: data.map(toUnit) } };
};

// NOTE: this reproduces a known upstream bug - "meal category" here was
// actually always the GeneralMealType resource (see deleteMealCategoryApi
// below, which really calls destroy on a general meal type). Kept pointed
// at /general-meal-types for behavioral parity; this function has no
// remaining callers in the app.
export const allMealsCategoryApi = async (): Promise<AllMealCategoryResponseProps> => {
    const { data } = await apiGet<{ data: RestGeneralMealType[] }>({ path: "/general-meal-types" });
    return {
        data: {
            allGeneralTypes: data.map((record) => ({
                id: record.id,
                name: record.name,
                code: '',
                description: record.description,
                sequence: 0,
                priority: 0,
                status: record.state,
                inUse: record.state === 'active',
            })),
        },
    };
};

export const getGeneralMealsApi = async (
    variables: GetGeneralMealTypeBodyParams
): Promise<GeneralMealTypeResponseProps> => {
    const { data } = await apiGet<{ data: RestGeneralMealType }>({
        path: `/general-meal-types/${variables.id}`,
    });
    return { data: { generalType: [toMealType(data)], errors: [] } };
};

export const getMealCategoryApi = async (
    variables: GetGeneralMealTypeBodyParams
): Promise<GeneralMealTypeResponseProps> => getGeneralMealsApi(variables);

export const createGeneralMealsApi = async (
    variables: CreateGeneralMealTypeBodyParams
): Promise<GeneralMealTypeResponseProps> => {
    const { data } = await apiPost<{ data: RestGeneralMealType }>({
        path: "/general-meal-types",
        body: toRestBody(variables),
    });
    return { data: { generalType: [toMealType(data)], errors: [] } };
};

export const updateGeneralMealsApi = async (
    variables: UpdateGeneralMealTypeBodyParams
): Promise<GeneralMealTypeResponseProps> => {
    const { data } = await apiPut<{ data: RestGeneralMealType }>({
        path: `/general-meal-types/${variables.id}`,
        body: toRestBody(variables),
    });
    return { data: { generalType: [toMealType(data)], errors: [] } };
};

export const deleteGeneralMealsApi = async (
    variables: GetGeneralMealTypeBodyParams
): Promise<DeleteGeneralMealTypeResponseProps> => {
    await apiDelete({ path: `/general-meal-types/${variables.id}` });
    return { data: { deleteGeneralType: { success: true, errors: [] } } };
};

// See the note on allMealsCategoryApi above - "meal category" delete was
// always really a general-meal-type delete in the old GraphQL layer.
export const deleteMealCategoryApi = async (
    variables: GetGeneralMealTypeBodyParams
): Promise<DeleteGeneralMealCategoryResponseProps> => {
    await apiDelete({ path: `/general-meal-types/${variables.id}` });
    return { data: { deleteCategory: { success: true, errors: [] } } };
};

export const updateMealTypeStateApi = async (
    variables: { id: string; state: string }
): Promise<GeneralMealTypeResponseProps> => {
    // There is no dedicated toggle-state route for general-meal-types on the
    // backend (unlike goals/cuisines), so this is implemented client-side as
    // a full PUT with the flipped `state` field.
    const { data } = await apiPut<{ data: RestGeneralMealType }>({
        path: `/general-meal-types/${variables.id}`,
        body: { state: stateToRest(variables.state) },
    });
    return { data: { generalType: [toMealType(data)], errors: [] } };
};
