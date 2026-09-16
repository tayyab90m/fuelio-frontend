import { apiDelete, apiGet, apiPost, apiPut } from "../../methods";
import {
  ActivityLevel,
  ActivityLevelResponse,
  CreateActivityLevelInput,
  CreateActivityLevelResponse,
  DeleteActivityLevelResponse,
  RestActivityLevel,
  UpdateActivityLevelInput,
  UpdateActivityLevelResponse,
} from "./type";

const toActivityLevel = (record: RestActivityLevel): ActivityLevel => ({
  id: record.id,
  name: record.name,
  multiplier: record.multiplier,
  description: record.description,
  stepRange: { min: record.stepRangeMin, max: record.stepRangeMax },
  workoutRange: { min: record.workoutRangeMin, max: record.workoutRangeMax },
  state: record.state,
});

const toRestBody = (input: CreateActivityLevelInput | UpdateActivityLevelInput) => ({
  name: input.name,
  multiplier: input.multiplier,
  description: input.description,
  stepRangeMin: input.stepRange?.min,
  stepRangeMax: input.stepRange?.max,
  workoutRangeMin: input.workoutRange?.min,
  workoutRangeMax: input.workoutRange?.max,
});

export const allActivityLevelsApi = async (): Promise<ActivityLevelResponse> => {
  const { data } = await apiGet<{ data: RestActivityLevel[] }>({ path: "/activity-levels" });
  return {
    data: {
      allActivityLevels: data.map(toActivityLevel),
      success: true,
    },
  };
};

export const createActivityLevelApi = async (
  input: CreateActivityLevelInput
): Promise<CreateActivityLevelResponse> => {
  const { data } = await apiPost<{ data: RestActivityLevel }>({
    path: "/activity-levels",
    body: toRestBody(input),
  });
  return {
    data: {
      createActivityLevel: {
        activityLevel: toActivityLevel(data),
        errors: [],
      },
    },
  };
};

export const updateActivityLevelApi = async (
  input: UpdateActivityLevelInput
): Promise<UpdateActivityLevelResponse> => {
  const { data } = await apiPut<{ data: RestActivityLevel }>({
    path: `/activity-levels/${input.id}`,
    body: toRestBody(input),
  });
  return {
    data: {
      updateActivityLevel: {
        activityLevel: toActivityLevel(data),
        errors: [],
      },
    },
  };
};

export const deleteActivityLevelApi = async (
  activityLevelId: string
): Promise<DeleteActivityLevelResponse> => {
  await apiDelete({ path: `/activity-levels/${activityLevelId}` });
  return {
    data: {
      destroyActivityLevel: {
        success: true,
        errors: [],
      },
    },
  };
};
