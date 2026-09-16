import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestionState } from './types';
import { SelectedQuestionairsProps, UpdateAnswerDataProps } from '../../interfaces/meal/types';

const initialState: QuestionState = {
  questions: [],
  answers: [],
  error: null,
  isLoading: false, // Track the loading state
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setAllQuestions: (state, { payload }: PayloadAction<QuestionState['questions']>) => {
      state.questions = payload;
      state.error = null;
    },
    setData: (state, action: PayloadAction<QuestionState['questions']>) => {
      state.questions = action.payload;
    },
    setAnswers: (state, action: PayloadAction<SelectedQuestionairsProps>) => {
      state.answers = [...state.answers, action.payload];
    },
    resetAnswers: (state) => {
      state.answers = [];
    },
    updateAnswers: (state, action: PayloadAction<UpdateAnswerDataProps>) => {
      const { questionId, answer, questionType, goalId, activityLevelId } = action.payload;
      const index = state.answers.findIndex((item) => item.questionId == questionId);
      if ((questionType == 'goal' && state.answers[index]?.goalId) || (questionType == 'activity_level' && state.answers[index]?.activityLevelId)) {
        state.answers.splice(index, 1);
      }
      if (index !== -1) {
        const indexOfOptions = state?.answers[index]?.answer.findIndex((item) => JSON.stringify(item) == JSON.stringify(answer));
        if (indexOfOptions !== -1) {
          if (state.answers[index]?.answer.length > 1) {
            state.answers[index]?.answer.splice(indexOfOptions, 1);
          } else {
            state.answers.splice(index, 1);
          }
        } else {
          if (questionType == 'goal') {
            state.answers[index] = {
              ...state.answers[index],
              answer: [],
              goalId
            }
          } else if (questionType == 'activity_level') {
            state.answers[index] = {
              ...state.answers[index],
              answer: [],
              activityLevelId
            }
          } else if (questionType == 'multiple_choice') {
            state.answers[index].answer = [...state.answers[index].answer, answer];
          } else {
            state.answers[index].answer = [answer]
          }
        }
      } else {
        if (questionType == 'goal') {
          state.answers = [...state.answers, {
            questionId,
            answer: [],
            goalId
          }]
        } else if (questionType == 'activity_level') {
          state.answers = [...state.answers, {
            questionId,
            answer: [],
            activityLevelId
          }]
        } else {
          state.answers = [...state.answers, {
            questionId,
            answer: [answer]
          }]
        }
      }
    },
    clearQuestionError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAllQuestions,
  setAnswers,
  setData,
  updateAnswers,
  clearQuestionError,
  resetAnswers,
} = questionSlice.actions;

export default questionSlice.reducer;
