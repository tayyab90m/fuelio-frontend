import { ActivityLevel } from "../../apiServices/endpoints/activity/type";
import { Goal } from "../../apiServices/endpoints/goals/types";

export interface MealTypesProps {
    id: string;
    name: string;
    code: string;
    description: string;
    state: string;
    proteinPercentage: number;
    carbsPercentage: number;
    fatsPercentage: number;
    minimumProtein: number;
    startTime: string; // Assuming ISO 8601 format (e.g., '2023-01-01T00:00:00Z')
    endTime: string;
}
export interface MealCategoryProps {
    id: string;
    name: string;
    code: string;
    description: string;
    sequence: number;
    priority: number;
    status: string;
    inUse: boolean;
}

export interface MealUnitProps {
    id: string,
    name: string,
    short: string,
    code: string,
    equivalentTo: string,
    unitType: string,
    system: string,
}
export type QuestionTypeProps = 'multiple_choice' | 'single_choice' | 'text' | 'activity_level' | 'goal' | 'number';
export interface Question {
    id: string;
    text: string;
    questionType: QuestionTypeProps;
    options: string[];
    state: string;
};
export interface QuestionairsDataProps {
    category: string;
    questions: Question[];
    activitiesData?: ActivityLevel[];
    selectedItems: SelectedQuestionairsProps[];
    goals: Goal[];
};
export interface AnswerDataProps {
    questionId: string;
    answer: string;
};
export interface SelectedQuestionairsProps {
    questionId: string;
    answer?: string[];
    activityLevelId?: string;
    goalId?: string;
};
export interface UpdateAnswerDataProps {
    questionId: string;
    answer: string;
    questionType: QuestionTypeProps;
    activityLevelId?: string;
    goalId?: string;
};
export interface IngredientsDataProps {
    id: string;
    name: string;
    min_amount: number;
    base_amount: number;
    max_amount: number;
    round_amount: number;
    unit: string;
}
export interface RecipeDataProps {
    id: string;
    name: string;
    description: string;
    prep_time: number;
    cook_time: number;
    instructions: [];
    ingredients: IngredientsDataProps[]
}
export interface MealDataProps {
    type: string;
    time: string;
    is_workout_meal: boolean;
    recipe: RecipeDataProps
}