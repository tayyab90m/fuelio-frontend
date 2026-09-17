import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  allQuestionsApi,
  createQuestionApi,
  updateQuestionApi,
  deleteQuestionApi,
  submitAnswerApi
} from '../../apiServices/endpoints/question';

import { setIsLoading } from '../meals/reducer';
import { store } from '../store';
import { resetAnswers, setAllQuestions, } from './reducer';
import { toast } from 'react-toastify';
import { CreateQuestionVariables, UpdateQuestionVariables, SubmitAnswerInput } from './types';
import { setData } from '../diet-plan/reducer';
import { NavigateFunction } from 'react-router';

// Helper function to handle errors
const handleError = (message: string) => {
  toast.error(message);
  store.dispatch(setIsLoading(false)); // Ensure loading state is turned off after error
};

// Fetch all questions
export const onMount = async () => {
  try {
    store.dispatch(setIsLoading(true));
    const response = await allQuestionsApi();
    if (response) {
      store.dispatch(setAllQuestions(response.data.allQuestions));
    }
  } finally {
    store.dispatch(setIsLoading(false));
  }
}
export const onSubmitQuestionair = async (navigate: NavigateFunction) => {
  try {
    store.dispatch(setIsLoading(true));
    const { answers } = store.getState().questionReducer
    const input = {
      answers
    }
    const response = await submitAnswerApi({ input });
    if (response.data.submitAnswer) {
      store.dispatch(setData(response.data.submitAnswer));
      navigate('/dashboard/diet-plan')
      store.dispatch(resetAnswers());
    }
  } catch (err: any) {
    handleError(err?.message || 'Failed to generate the diet plan.');
  } finally {
    store.dispatch(setIsLoading(false));
  }
}
// Create a new question
export const createQuestion = createAsyncThunk(
  'questions/createQuestion',
  async (variables: CreateQuestionVariables, { rejectWithValue }) => {
    try {
      const response = await createQuestionApi(variables);
      // If there are errors, handle them accordingly
      if (response?.data?.createQuestion?.errors) {
        return rejectWithValue(response.data.createQuestion.errors[0]);
      }
      return response?.data?.createQuestion?.question;
    } catch (error) {
      handleError('Failed to create question');
      return rejectWithValue('Failed to create question');
    }
  }
);

// Update a question
export const updateQuestion = createAsyncThunk(
  'questions/updateQuestion',
  async (variables: UpdateQuestionVariables, { rejectWithValue }) => {
    try {
      const response = await updateQuestionApi(variables);
      return response?.data?.updateQuestion?.question;
    } catch (error) {
      handleError('Failed to update question');
      return rejectWithValue('Failed to update question');
    }
  }
);

// Delete a question
export const deleteQuestionAction = createAsyncThunk(
  'questions/deleteQuestion',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteQuestionApi(id);
      if (response?.data?.deleteQuestion?.success) {
        return { id };
      } else {
        return rejectWithValue(response?.data?.deleteQuestion?.errors[0] || 'Failed to delete question');
      }
    } catch (error) {
      handleError('Failed to delete question');
      return rejectWithValue('Failed to delete question');
    }
  }
);