import { ActivityLevel } from "../../apiServices/endpoints/activity/type";
import { Goal } from "../../apiServices/endpoints/goals/types";
import { Question } from "../../interfaces/meal/types";

export interface SelectionSectionProps extends Question {
    onPress?: (data: SelectedQuestionairsProps) => void;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    defaultValues?: SelectedQuestionairsProps;
    goals: Goal[];
    activityLevels: ActivityLevel[];
}