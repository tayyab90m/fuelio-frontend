import { Category, CategoryWithDates } from "../../apiServices/endpoints/categories/types";

export interface CategoryState {
  categories: CategoryWithDates[];
  error: string | null;
  loading: boolean;
}

export interface CategoryResponse {
  success: boolean;
  category?: Category;
  errors?: string[];
}
