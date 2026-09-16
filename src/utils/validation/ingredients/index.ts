import * as Yup from "yup";

export const IngredientSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .max(100, "Name must be at most 100 characters"),
  calories: Yup.number()
    .min(0, "Calories must be greater than or equal to 0")
    .nullable(), // Allows undefined or null
  protein: Yup.number()
    .min(0, "Protein must be greater than or equal to 0")
    .nullable(),
  fat: Yup.number()
    .min(0, "Fat must be greater than or equal to 0")
    .nullable(),
  vegan: Yup.boolean(),
  vegetarian: Yup.boolean(),
  glutenFree: Yup.boolean(),
  servingSizeAmount: Yup.number()
    .required("Serving size amount is required")
    .min(1, "Serving size must be at least 1"),
  servingSizeUnit: Yup.string()
    .required("Serving size unit is required")
    .max(50, "Serving size unit must be at most 50 characters"),
});
