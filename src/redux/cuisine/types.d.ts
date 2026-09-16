import { Cuisine } from "../../apiServices/endpoints/cuisine/types";

export interface CuisineState {
  cuisines: Cuisine[];
  error: string | null;
}
