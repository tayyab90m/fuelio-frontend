import * as Yup from 'yup';

export const IngredientSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  
  calories: Yup.number()
    .min(0, 'Calories must be positive')
    .nullable(),
  
  protein: Yup.number()
    .min(0, 'Protein must be positive')
    .nullable(),
  
  fat: Yup.number()
    .min(0, 'Fat must be positive')
    .nullable(),
  
  carbs: Yup.number()
    .min(0, 'Carbs must be positive')
    .nullable(),
  
  vegan: Yup.boolean(),
  vegetarian: Yup.boolean(),
  glutenFree: Yup.boolean(),
  
  servingSizeAmount: Yup.number()
    .required('Serving size amount is required')
    .positive('Serving size amount must be positive'),
  
  servingSizeUnit: Yup.string()
    .required('Serving size unit is required'),
  
  unitId: Yup.string()
    .required('Unit is required'), // Matches the form's select input for units
});


// export const IngredientSchema = Yup.object().shape({
//   name: Yup.string()
//     .required('Name is required')
//     .min(2, 'Name must be at least 2 characters'),
//   description: Yup.string(),
//   calories: Yup.number()
//     .min(0, 'Calories must be positive')
//     .nullable(),
//   protein: Yup.number()
//     .min(0, 'Protein must be positive')
//     .nullable(),
//   fat: Yup.number()
//     .min(0, 'Fat must be positive')
//     .nullable(),
//   carbs: Yup.number()
//     .min(0, 'Carbs must be positive')
//     .nullable(),
//   vegan: Yup.boolean(),
//   vegetarian: Yup.boolean(),
//   glutenFree: Yup.boolean(),
//   servingSizeAmount: Yup.number()
//     .required('Serving size amount is required')
//     .positive('Serving size amount must be positive'),
//   servingSizeUnit: Yup.string()
//     .required('Serving size unit is required'),
//   // categoryId: Yup.string(
// }); 