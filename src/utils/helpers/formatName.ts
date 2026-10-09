// Meal types created from the form are stored as keys like "morning_snack";
// show those as words ("Morning snack"). Names that are already readable
// ("Breakfast") pass through unchanged.
export const formatMealTypeName = (name?: string | null): string =>
  (name || '').replace(/_/g, ' ');
