import { AllGoalsResponse } from "../../apiServices/endpoints/goals/types";

export interface AllGoals {
  goals: Goal[];
  error: string | null;
}