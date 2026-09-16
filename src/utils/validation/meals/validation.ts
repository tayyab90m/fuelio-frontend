import * as Yup from 'yup';

export const mealValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Meal name is required')
    .min(3, 'Meal name must be at least 3 characters')
    .max(100, 'Meal name must be less than 100 characters'),
  
  description: Yup.string()
    .max(500, 'Description cannot exceed 500 characters'),
  
  categoryIds: Yup.array()
    .min(1, 'At least one category must be selected')
    .required('Categories are required'),
  
  generalTypeIds: Yup.array()
    .min(1, 'At least one meal type must be selected')
    .required('Meal types are required'),
  
  recipeIds: Yup.array()
    .min(1, 'At least one recipe must be selected')
    .required('Recipes are required')
});