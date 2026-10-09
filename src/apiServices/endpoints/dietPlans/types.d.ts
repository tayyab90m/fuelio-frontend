import { RestSubmitAnswerBody, RestSubmitAnswerResponse } from '../question/type';

export interface SavedPlanSummary {
  id: string;
  name: string;
  macros: { calories: number; protein: number; fat: number; carbs: number } | null;
  createdAt: string;
}

export interface SavedPlan {
  id: string;
  name: string;
  input: RestSubmitAnswerBody;
  // Same shape as the submit-answer response.
  result: RestSubmitAnswerResponse;
  createdAt: string;
  updatedAt: string;
}
