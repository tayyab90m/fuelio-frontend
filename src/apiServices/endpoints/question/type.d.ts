import { AnswerDataProps, Question, QuestionairsDataProps } from "../../../interfaces/meal/types";
import { Option } from "../../../redux/questionnaire/types";

// Each element carries both the plain Question fields (id/text/questionType/
// options/state, consumed directly by screens/meal-dashboard/mealGenerator
// which spreads one element per wizard step) and the legacy
// QuestionairsDataProps shape the redux `questions` slice is typed with, so
// this is assignable to both without changing redux/questionaire/types.ts.
export interface AllQuestionsResponse {
  data: {
      allQuestions: (QuestionairsDataProps & Question)[];
  }
}

export interface CreateQuestionVariables {
  input: {
    text: string;
    questionType: string;
    options: Option[];
    state: 'published' | 'unpublished';
  };
}

export interface CreateQuestionResponse {
  data?: {
    createQuestion: {
      question?: Question;
      success?: boolean;
      errors?: string[]; // Optional errors field
    };
  };
}

export interface UpdateQuestionVariables {
  input: {
    id: string;
    text?: string;
    questionType?: string;
    options?: Option[];
    state?: 'published' | 'unpublished';
  };
}

export interface UpdateQuestionResponse {
  data?: {
    updateQuestion: {
      question?: Question;
      success?: boolean;
      errors?: string[]; // Optional errors field
    };
  };
}

export interface DeleteQuestionVariables {
  input: {
    id: string; // id of the question to be deleted
  };
}

export interface DeleteQuestionResponse {
  data?: {
    deleteQuestion: {
      success?: boolean;
      errors?: string[]; // Optional errors field
    };
  };
}

export interface SubmitQuestionsRequest {
  input: {
      answers: AnswerDataProps[]
  };
}
export interface SubmitAnswerResponse {
  data?: {
    submitAnswer: {
      success?: boolean;
      errors?: string[];
      userAnswers?: {
        id: string;
        questionId: string;
        answer: string;
      }[];
    };
  };
}

// Raw shape returned/accepted by the REST backend - see
// fitness-dashboard-backend/src/modules/questions/questions.schema.ts (CRUD)
// and dietPlan.service.ts (submit-answer).
export interface RestQuestion {
  id: string;
  text: string;
  questionType: string;
  options: unknown;
  state: 'active' | 'inactive';
}

// POST /api/v1/questions/submit-answer request. Unlike the old GraphQL
// mutation (a generic list of {questionId, answer} pairs), the REST
// backend's placeholder diet-plan calculation needs these specific
// physiological fields directly.
export interface RestSubmitAnswerBody {
  age: number;
  sex: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  activityLevelId: string;
  goalId: string;
  [extra: string]: unknown;
}

export interface RestSubmitAnswerResponse {
  userAnswers: unknown;
  macros: { calories: number; protein: number; fat: number; carbs: number };
  macrosDistribution: Array<{
    name: string;
    timing: string;
    description: string;
    macros: { calories: number; protein: number; fat: number; carbs: number };
  }>;
  mealFramework: string;
  errors: string[];
}
