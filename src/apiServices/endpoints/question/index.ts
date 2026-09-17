import { DietPlanStateProps } from "../../../redux/diet-plan/types";
import { Question, QuestionairsDataProps } from "../../../interfaces/meal/types";
import { apiDelete, apiGet, apiPost, apiPut } from "../../methods";
import { store } from "../../../redux/store";
import {
  AllQuestionsResponse,
  CreateQuestionResponse,
  CreateQuestionVariables,
  DeleteQuestionResponse,
  RestQuestion,
  RestSubmitAnswerBody,
  RestSubmitAnswerResponse,
  SubmitQuestionsRequest,
  UpdateQuestionResponse,
  UpdateQuestionVariables,
} from "./type";

const stateToRest = (state?: 'published' | 'unpublished'): 'active' | 'inactive' | undefined => {
  if (state === undefined) return undefined;
  return state === 'unpublished' ? 'inactive' : 'active';
};

const stateFromRest = (state: RestQuestion['state']): 'published' | 'unpublished' =>
  state === 'active' ? 'published' : 'unpublished';

const toQuestion = (record: RestQuestion): Question => ({
  id: record.id,
  text: record.text,
  questionType: record.questionType as Question['questionType'],
  options: (Array.isArray(record.options) ? record.options : []) as string[],
  state: stateFromRest(record.state),
});

// See type.d.ts: each element needs to satisfy both `Question` (consumed
// directly by screens/meal-dashboard/mealGenerator) and the legacy
// `QuestionairsDataProps` shape the redux `questions` slice is typed with.
const toQuestionairsItem = (record: RestQuestion): QuestionairsDataProps & Question => {
  const question = toQuestion(record);
  return {
    ...question,
    category: '',
    questions: [question],
    selectedItems: [],
    goals: [],
  };
};

// Fetch all questions
export const allQuestionsApi = async (): Promise<AllQuestionsResponse> => {
  const { data } = await apiGet<{ data: RestQuestion[] }>({ path: "/questions" });
  return { data: { allQuestions: data.map(toQuestionairsItem) } };
};

// Create a new question
export const createQuestionApi = async (variables: CreateQuestionVariables): Promise<CreateQuestionResponse> => {
  const { input } = variables;
  const { data } = await apiPost<{ data: RestQuestion }>({
    path: "/questions",
    body: {
      text: input.text,
      questionType: input.questionType,
      options: input.options,
      state: stateToRest(input.state),
    },
  });
  return { data: { createQuestion: { question: toQuestion(data), success: true, errors: [] } } };
};

// Update an existing question
export const updateQuestionApi = async (variables: UpdateQuestionVariables): Promise<UpdateQuestionResponse> => {
  const { input } = variables;
  const { data } = await apiPut<{ data: RestQuestion }>({
    path: `/questions/${input.id}`,
    body: {
      text: input.text,
      questionType: input.questionType,
      options: input.options,
      state: stateToRest(input.state),
    },
  });
  return { data: { updateQuestion: { question: toQuestion(data), success: true, errors: [] } } };
};

// Delete a question
export const deleteQuestionApi = async (id: string): Promise<DeleteQuestionResponse> => {
  await apiDelete({ path: `/questions/${id}` });
  return { data: { deleteQuestion: { success: true, errors: [] } } };
};

// ---------------------------------------------------------------------------
// Submit an answer / diet-plan calculation.
//
// The old GraphQL mutation took a generic list of {questionId, answer} pairs
// (one per dynamically admin-defined Question). The REST backend's
// POST /questions/submit-answer instead expects a fixed set of physiological
// fields directly: { age, sex, heightCm, weightKg, activityLevelId, goalId }
// (see fitness-dashboard-backend/src/modules/questions/dietPlan.service.ts -
// itself explicitly documented there as placeholder business logic).
//
// There is no stored convention linking a dynamic Question's id to which of
// those physiological fields it represents, EXCEPT for activityLevelId/
// goalId, which the questionnaire reducer already tags explicitly on the
// answer entry (see redux/questionaire/reducer.ts's updateAnswers). For the
// remaining fields (age/sex/height/weight) this falls back to a best-effort
// keyword match against the loaded Question's `text`, since that's the only
// signal available. This is a known limitation of adapting a generic Q&A
// model onto the backend's fixed-shape placeholder calculation.
// ---------------------------------------------------------------------------
const matchNumeric = (keywords: string[]): number | undefined => {
  const { questions } = store.getState().questionReducer;
  for (const q of questions as any[]) {
    if (keywords.some((kw) => q?.text?.toLowerCase?.().includes(kw))) {
      const answer = (store.getState().questionReducer.answers as any[]).find(
        (a) => a.questionId === q.id
      );
      const raw = Array.isArray(answer?.answer) ? answer.answer[0] : answer?.answer;
      const parsed = raw !== undefined ? Number(raw) : undefined;
      if (parsed !== undefined && !Number.isNaN(parsed)) return parsed;
    }
  }
  return undefined;
};

const matchSex = (): 'male' | 'female' | undefined => {
  const { questions } = store.getState().questionReducer;
  for (const q of questions as any[]) {
    if (q?.text?.toLowerCase?.().includes('sex') || q?.text?.toLowerCase?.().includes('gender')) {
      const answer = (store.getState().questionReducer.answers as any[]).find(
        (a) => a.questionId === q.id
      );
      const raw = (Array.isArray(answer?.answer) ? answer.answer[0] : answer?.answer)?.toLowerCase?.();
      if (raw === 'male' || raw === 'female') return raw;
    }
  }
  return undefined;
};

export const submitAnswerApi = async (variables: SubmitQuestionsRequest): Promise<DietPlanStateProps> => {
  const answers = (variables.input.answers || []) as any[];
  const activityLevelId = answers.find((a) => a.activityLevelId)?.activityLevelId;
  const goalId = answers.find((a) => a.goalId)?.goalId;

  const age = matchNumeric(['age']);
  const sex = matchSex();
  const heightCm = matchNumeric(['height']);
  const weightKg = matchNumeric(['weight']);

  // Defaulting any of these to 0/'male' when unresolved would silently send
  // physiologically nonsensical values to the calculation endpoint and come
  // back with a garbage-but-plausible-looking diet plan. Fail loudly instead
  // so the caller (onSubmitQuestionair) can surface a clear error.
  const missing = [
    age === undefined && 'age',
    sex === undefined && 'sex',
    heightCm === undefined && 'height',
    weightKg === undefined && 'weight',
    !activityLevelId && 'activity level',
    !goalId && 'goal',
  ].filter(Boolean);
  if (missing.length > 0) {
    throw new Error(`Please answer all required questions before submitting (missing: ${missing.join(', ')}).`);
  }

  const body: RestSubmitAnswerBody = { age, sex, heightCm, weightKg, activityLevelId, goalId };

  const result = await apiPost<RestSubmitAnswerResponse>({ path: "/questions/submit-answer", body });

  return {
    data: {
      submitAnswer: result.userAnswers,
      macros: result.macros,
      macrosDistribution: result.macrosDistribution,
      // The backend's placeholder calculation returns a plain descriptive
      // string (see RestSubmitAnswerResponse.mealFramework) rather than a
      // structured day-by-day meal plan + shopping list - there is no real
      // data to populate `data`/`shopping_list` with yet, so they're left
      // empty and the UI (screens/meal-dashboard/mealGenerator/result)
      // gracefully renders nothing for that section.
      mealFramework: {
        data: [],
        shopping_list: {},
      },
    },
    isLoading: false,
  };
};
