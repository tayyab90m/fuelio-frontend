import { ActivityLevel } from "../../apiServices/endpoints/activity/type";

export interface ActivityLevelState {
  activityLevels: ActivityLevel[];
  error: string | null;
}
