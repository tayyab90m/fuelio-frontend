export interface CalorieAdjustment {
  type: 'deficit' | 'surplus' | 'maintenance';
  percentage: number;
}

export interface MacroRatios {
  fats: number;
  carbs: number;
  protein: number;
}

export interface Goal {
  id?: string;
  name: string;
  description: string;
  calorieAdjustment: CalorieAdjustment;
  macroRatios: MacroRatios;
  state?: 'published' | 'unpublished';
}

export type CreateGoalVariables = Omit<Goal, 'id'>;

interface BaseResponse {
  errors?: string[];
}

export interface CreateGoalResponse {
  data?: {
    createGoal?: {
      goal?: Goal | null;
    } & BaseResponse;
  }
}

export interface AllGoalsResponse {
  data?: {
    allGoals: Goal[];
  }
}

export interface DeleteGoalResponse {
  data?: {
    deleteGoal?: {
      success?: boolean;
    } & BaseResponse;
  }
}

export interface UpdateGoalStateResponse {
  data?: {
    updateGoal?: {
      goal?: Goal;
    } & BaseResponse;
  }
}

export interface UpdateGoalResponse {
  data?: {
    updateGoal?: {
      goal?: Goal;
    } & BaseResponse;
  }
}

// Raw shape returned/accepted by the REST backend (GET/POST/PUT
// /api/v1/goals) - see
// fitness-dashboard-backend/src/modules/goals/goals.schema.ts.
// state: "active" | "inactive". calorieAdjustment.type: "increase" |
// "decrease" | "maintain" (frontend uses "surplus"/"deficit"/"maintenance").
export interface RestGoal {
  id: string;
  name: string;
  description: string;
  calorieAdjustment: {
    type: 'increase' | 'decrease' | 'maintain';
    percentage: number;
  };
  macroRatios: MacroRatios;
  state: 'active' | 'inactive';
  categories?: unknown[];
}
