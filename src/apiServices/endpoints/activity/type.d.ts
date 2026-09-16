export interface ActivityLevel {
  id: string;
  name: string;
  multiplier: number;
  description?: string;
  stepRange: {
    min: number;
    max: number;
  };
  workoutRange: {
    min: number;
    max: number;
  };
  state: string;
}

export interface CreateActivityLevelInput {
  name: string;
  multiplier: number;
  description?: string;
  stepRange: {
    min: number;
    max: number;
  };
  workoutRange: {
    min: number;
    max: number;
  };
}

export interface UpdateActivityLevelInput extends CreateActivityLevelInput {
  id: string;
}

export interface ActivityLevelResponse {
  data: {
    allActivityLevels: ActivityLevel[];
    errors?: string[];
    success: boolean;

  }
}

export interface UpdateActivityLevelResponse {
  data?: {
    updateActivityLevel?: {
      activityLevel: ActivityLevel;
      errors: string[];
    };
  };
}
export interface CreateActivityLevelResponse {
  data?: {
    createActivityLevel?: {
      activityLevel: ActivityLevel;
      errors: string[];
    };
  };
}
export interface AllActivityLevelsResponse {
  allActivityLevels: ActivityLevel[];
}

export interface DeleteActivityLevelResponse {
  data?: {
    destroyActivityLevel?: {
      success: boolean;
      errors?: string[];
    };
  };
}

// Flat shape actually returned/accepted by the REST backend
// (GET/POST/PUT /api/v1/activity-levels) - see
// fitness-dashboard-backend/src/modules/activityLevels/activityLevels.schema.ts
export interface RestActivityLevel {
  id: string;
  name: string;
  multiplier: number;
  description: string;
  stepRangeMin: number;
  stepRangeMax: number;
  workoutRangeMin: number;
  workoutRangeMax: number;
  state: string;
}
