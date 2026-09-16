// Option type used for question options
// export interface Option {
//   value: string;
//   label: string;
// }

import { Question, QuestionairsDataProps, SelectedQuestionairsProps } from "../../interfaces/meal/types";

// Option type used for question options
export type Option = string;

// Question interface with all required properties
export interface QuestionState {
  questions: QuestionairsDataProps[];
  answers: SelectedQuestionairsProps[];
  error: string | null;
  isLoading: boolean;
}

// Response type for fetching all questions
export interface AllQuestionsResponse {
  data?: {
    allQuestions: {
      category?: string; // category is optional
      questions: Question[]; // The list of questions
    };
  };
}

// Variables to create a new question
export interface CreateQuestionVariables {
  input: {
    text: string;
    questionType: string;
    options: Option[];
    state: 'published' | 'unpublished';
  };
}

// Response after creating a new question
export interface CreateQuestionResponse {
  data?: {
    createQuestion: {
      question: Question;
      success: boolean;
      errors?: string[]; // Errors are optional
    };
  };
}

// Variables to update an existing question
export interface UpdateQuestionVariables {
  input: {
    id: string;
    text?: string;
    questionType?: string;
    options?: Option[];
    state?: 'published' | 'unpublished';
  };
}

// Response after updating a question
export interface UpdateQuestionResponse {
  data?: {
    updateQuestion: {
      question: Question;
      success: boolean;
      errors?: string[]; // Errors are optional
    };
  };
}

// Response after deleting a question
export interface DeleteQuestionResponse {
  data?: {
    deleteQuestion: {
      success: boolean;
      errors?: string[]; // Errors are optional
    };
  };
}

// Input for submitting an answer
// In apiServices/endpoints/question/type.ts
export interface SubmitAnswerInput {
  input: {
    questionId: string;
    answer: string;
  };
}


// Response after submitting an answer
export interface SubmitAnswerResponse {
  data?: {
    submitAnswer: {
      userAnswer: {
        id: string;
        questionId: string;
        answer: string;
      };
      success: boolean;
      errors?: string[]; // Errors are optional
    };
  };
}

// Action types for different actions related to questions
export const FETCH_ALL_QUESTIONS = 'FETCH_ALL_QUESTIONS';
export const CREATE_QUESTION = 'CREATE_QUESTION';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';
export const DELETE_QUESTION = 'DELETE_QUESTION';
export const SUBMIT_ANSWER = 'SUBMIT_ANSWER';
