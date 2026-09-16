import { store } from "../store";
import { createCategory as createCategoryApi, updateCategory as updateCategoryApi, deleteCategory as deleteCategoryApi, getAllCategories } from "../../apiServices/endpoints/categories";
import { setLoading, setCategories, addCategory, updateCategory, removeCategory, setError } from "./reducer";
import { CreateCategoryInput, UpdateCategoryInput, CategoryWithDates } from "../../apiServices/endpoints/categories/types";
import { toast } from "react-toastify";

export const fetchCategories = async () => {
  try {
    store.dispatch(setLoading(true));
    const response = await getAllCategories();
    if (response?.data?.allCategories) {
      store.dispatch(setCategories(response.data.allCategories));
    }
  } catch (error) {
    store.dispatch(setError('Failed to fetch categories'));
    toast.error('Failed to fetch categories');
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const createCategory = async (input: CreateCategoryInput) => {
  try {
    store.dispatch(setLoading(true));
    const response = await createCategoryApi(input);
    if (response?.data?.createCategory?.category) {
      store.dispatch(addCategory(response.data.createCategory.category as CategoryWithDates));
      toast.success('Category created successfully');
      return response;
    }
  } catch (error) {
    store.dispatch(setError('Failed to create category'));
    toast.error('Failed to create category');
  } finally {
    store.dispatch(setLoading(false));
  }
  return null;
};

export const updateCategoryById = async (input: UpdateCategoryInput) => {
  try {
    store.dispatch(setLoading(true));
    const response = await updateCategoryApi(input);
    if (response?.data?.updateCategory?.category) {
      store.dispatch(updateCategory(response.data.updateCategory.category as CategoryWithDates));
      toast.success('Category updated successfully');
      return response;
    }
  } catch (error) {
    store.dispatch(setError('Failed to update category'));
    toast.error('Failed to update category');
  } finally {
    store.dispatch(setLoading(false));
  }
  return null;
};

export const deleteCategory = async (id: string) => {
  try {
    store.dispatch(setLoading(true));
    const response = await deleteCategoryApi(id);
    if (response?.data?.deleteCategory?.success) {
      store.dispatch(removeCategory(id));
      toast.success('Category deleted successfully');
      return response;
    }
  } catch (error) {
    store.dispatch(setError('Failed to delete category'));
    toast.error('Failed to delete category');
  } finally {
    store.dispatch(setLoading(false));
  }
  return null;
};
