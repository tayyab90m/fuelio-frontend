import React, { useState, useEffect, FormEvent, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import {
  Plus,
  Search,
  Filter,
  Clock,
  Utensils,
  Users,
  Pencil,
  Trash,
  ChevronsUpDown,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  onGetAllRecipes as fetchRecipes,
  onCreateRecipe as createRecipe,
  onUpdateRecipe as updateRecipe,
  onDeleteRecipe as deleteRecipe
} from '../../../redux/recipes/action';
import { Recipe } from '../../../apiServices/endpoints/recipes/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { onGetIngredients } from '../../../redux/ingredients/action';
import { toast } from 'react-toastify';
import { Ingredient } from '../../../apiServices/endpoints/ingredients/types';
import { CreateRecipeInput } from '../../../apiServices/endpoints/recipes/types';
import { onGetAllUnits } from '../../../redux/meals/action';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export function RecipesConfig() {
  const dispatch = useDispatch();
  const { recipes, loading } = useSelector((state: RootState) => state.recipes);
  const ingredients = useSelector((state: RootState) =>
    state.ingredientReducer.allIngredients
  ) as Ingredient[];
  const { mealUnits } = useSelector((state: RootState) => state.mealsReducer)
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const initialFormState: Omit<CreateRecipeInput, 'recipeIngredientsAttributes'> = {
    name: '',
    description: '',
    prepTime: 0,
    cookTime: 0,
    // difficulty: 1,
    servings: 0,
    // categoryIds: [],
    // nutrients: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    // },
    instructions: []
  };

  interface SelectedIngredient {
    id: string | undefined;  // The ingredient ID
    ingredientId: string;    // The ingredient's ID from the list
    unitId: string;          // The unit ID for the ingredient
    minAmount?: number;      // Optional field for min amount
    baseAmount?: number;     // Optional field for base amount
    maxAmount?: number;      // Optional field for max amount
  }

  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  interface InstructionStep {
    id: string;
    text: string;
  }

  const [instructionSteps, setInstructionSteps] = useState<InstructionStep[]>([]);

  const RecipeValidationSchema = Yup.object().shape({
    name: Yup.string().required('Recipe name is required'),
    description: Yup.string().required('Description is required'),
    prepTime: Yup.number()
      .min(0, 'Prep time cannot be negative')
      .required('Prep time is required'),
    cookTime: Yup.number()
      .min(0, 'Cook time cannot be negative')
      .required('Cook time is required'),
    servings: Yup.number()
      .min(1, 'Must serve at least 1 person')
      .required('Number of servings is required'),
    // nutrients: Yup.object().shape({
    calories: Yup.number().min(0, 'Cannot be negative'),
    protein: Yup.number().min(0, 'Cannot be negative'),
    carbs: Yup.number().min(0, 'Cannot be negative'),
    fat: Yup.number().min(0, 'Cannot be negative')
    //})
  });

  const formik = useFormik({
    initialValues: initialFormState,
    validationSchema: RecipeValidationSchema,
    onSubmit: async (values) => {
      const totalNutrients = calculateTotalNutrients(selectedIngredients);
      try {
        const recipeData: CreateRecipeInput = {
          ...values,
          calories: Number(totalNutrients.calories.toFixed(1)) || 0,
          protein: Number(totalNutrients.protein.toFixed(1)) || 0,
          carbs: Number(totalNutrients.carbs.toFixed(1)) || 0,
          fat: Number(totalNutrients.fat.toFixed(1)) || 0,
          instructions: instructionSteps.map(step => step.text).filter(text => text.trim() !== ''),
          recipeIngredientsAttributes: selectedIngredients?.map(ing => ({
            ...ing,
            id: Number(ing.id),
            baseAmount: Number(ing.baseAmount),
            maxAmount: Number(ing.baseAmount),
            minAmount: Number(ing.baseAmount),
            roundAmount: Number(ing.baseAmount)


          }))
        };
        if (editingRecipe) {
          await updateRecipe({
            id: editingRecipe.id,
            ...recipeData
          });
        } else {
          await createRecipe(recipeData);
        }
        handleDialogClose();
      } catch (error) {
        toast.error('Failed to save recipe');
      }
    }
  });

  useEffect(() => {
    fetchRecipes();
    onGetIngredients();
    if (!mealUnits?.length) {
      onGetAllUnits();
    }
  }, [dispatch]);

  useEffect(() => {
    if (editingRecipe) {
      formik.setValues({
        name: editingRecipe.name,
        description: editingRecipe.description || '',
        prepTime: editingRecipe.prepTime,
        cookTime: editingRecipe.cookTime,
        servings: editingRecipe.servings,
        // difficulty: Number(editingRecipe.difficulty) || 1,
        // nutrients: editingRecipe.nutrients || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        // },
        instructions: editingRecipe.instructions || [],
      });

      // Only set ingredients if they exist in the editing recipe
      if (editingRecipe.recipeIngredients && editingRecipe.recipeIngredients.length > 0) {

        setSelectedIngredients(
          editingRecipe.recipeIngredients.map(ri => ({
            id: ri.id,
            ingredientId: ri.ingredient.id,
            unitId: ri.unit.id,
            baseAmount: ri.baseAmount,
            maxAmount: ri.baseAmount,
            minAmount: ri.baseAmount,
            roundAmount: ri.baseAmount
          }))
        );
      } else {
        setSelectedIngredients([]); // Reset if no ingredients
      }

      // Set instruction steps if they exist
      if (editingRecipe.instructions && editingRecipe.instructions.length > 0) {
        setInstructionSteps(
          editingRecipe.instructions.map((instruction, index) => ({
            id: crypto.randomUUID(),
            text: instruction
          }))
        );
      } else {
        setInstructionSteps([]); // Reset if no instructions
      }
    }

  }, [editingRecipe]);

  const handleAddIngredient = () => {
    setSelectedIngredients((prevState) => {
      return [
        ...prevState,
        { id: undefined, ingredientId: '', unitId: '' }
      ]
    });
  };
  const handleIngredientChange = (index, field, value) => {
    setSelectedIngredients((prevState) => {
      const newIngredients = [...prevState];
      newIngredients[index][field] = value;
      return newIngredients;
    });
  };

  const handleRemoveIngredient = (index) => {
    setSelectedIngredients((prevState) => prevState.filter((_, idx) => idx !== index));
  };


  const handleDialogClose = () => {
    setShowRecipeForm(false);
    formik.resetForm();
    setEditingRecipe(null);
  };

  const getIngredientNutrients = (ingredientId: string) => {
    return ingredients.find((ing) => ing.id === ingredientId);
  };


  const filteredRecipes = useMemo(() => {
    return recipes?.filter(recipe => {
      if (!recipe) return false;
      const recipeName = recipe.name?.toString() || '';

      return recipeName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [recipes, searchTerm]);

  // Replace the handleAddInstruction function
  const handleAddInstruction = () => {
    setInstructionSteps([
      ...instructionSteps,
      { id: crypto.randomUUID(), text: '' }
    ]);
  };

  // Add this new function to handle instruction text changes
  const handleInstructionChange = (id: string, text: string) => {
    setInstructionSteps(
      instructionSteps.map(step =>
        step.id === id ? { ...step, text } : step
      )
    );
  };

  // Update the handleRemoveInstruction function
  const handleRemoveInstruction = (id: string) => {
    setInstructionSteps(instructionSteps.filter(step => step.id !== id));
  };

  const handleDelete = (recipeId: string) => {
    deleteRecipe(recipeId);
  };

  const handleAddRecipe = () => {
    setEditingRecipe(null);  // Reset editing state
    formik.resetForm();      // Reset form values
    setShowRecipeForm(true); // Show the form
    setSelectedIngredients([]); // Reset ingredients
    setInstructionSteps([]); // Reset instructions
  };

  // Function to calculate the total nutrients (fat, carbs, calories, protein)
  const calculateTotalNutrients = (data: SelectedIngredient[]) => {
    return data.reduce(
      (totals, item) => {
        const nutrientData = getIngredientNutrients(item.ingredientId);
        if (nutrientData) {
          totals.calories += nutrientData.calories * (item.baseAmount); // Assuming baseAmount is in grams
          totals.protein += nutrientData.protein * (item.baseAmount);
          totals.fat += nutrientData.fat * (item.baseAmount);
          totals.carbs += nutrientData.carbs * (item.baseAmount);
        }
        return totals;
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  };
  // useEffect(() => {
  //   if (selectedIngredients.length > 0) {
  //     const totalNutrients = calculateTotalNutrients(selectedIngredients);
  //     formik.setFieldValue("calories", Number(totalNutrients.calories.toFixed(1)) || 0);
  //     formik.setFieldValue("protein", Number(totalNutrients.protein.toFixed(1)) || 0);
  //     formik.setFieldValue("carbs", Number(totalNutrients.carbs.toFixed(1)) || 0);
  //     formik.setFieldValue("fat", Number(totalNutrients.fat.toFixed(1)) || 0);
  //   }
  // }, [selectedIngredients, formik]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Button
          size="sm"
          className="bg-primary gap-2 font-bold text-sm text-white hover:bg-primary/80"
          onClick={handleAddRecipe}
        >
          <Plus className="w-4 h-4" />
          Add Recipe
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <Button className="bg-secondary font-bold text-sm text-white hover:bg-secondary/80" variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}

      {/* Show table only when not loading */}
      {!loading && (
        <Card className="bg-white shadow border-none overflow-auto rounded-xl">
          <Table className="min-w-full divide-y divide-gray-300">
            <TableHeader className="bg-secondary text-white">
              <TableRow className="text-white text-sn font-semibold">
                <TableHead className="px-4 w-[200px] py-4 text-sn font-semibold ">Recipe</TableHead>
                {/* <TableHead className="px-4 py-4 text-sn text-center font-semibold">Category</TableHead> */}
                <TableHead className="px-4 py-4 text-sn text-center font-semibold">Nutrition</TableHead>
                <TableHead className="px-4 py-4 text-sn text-center font-semibold">Time</TableHead>
                <TableHead className="px-4 py-4 text-sn text-center font-semibold">Status</TableHead>
                <TableHead className="px-4 py-4 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {filteredRecipes?.map((recipe) => {
                const totalNutrients = calculateTotalNutrients(
                  recipe.recipeIngredients.map((item) => {
                    return {
                      ...item,
                      ingredientId: item.ingredient.id,
                      unitId: item.unit.id,
                      amount: item.baseAmount,
                    }
                  }));
                return (
                  <TableRow key={recipe.id} className="hover:bg-gray-50 transition">
                    <TableCell className="px-4 py-3">
                      <div className="font-semibold capitalize text-gray-900">{recipe.name}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                            🔥
                          </span>
                          {totalNutrients.calories.toFixed(1)} kcal
                        </span>
                        <div className="flex gap-2">
                          <Badge className="min-w-[60px] py-1 font-medium border bg-green-50 text-green-700 border-green-200">
                            P: {totalNutrients.protein.toFixed(2)} g
                          </Badge>
                          <Badge className="min-w-[60px] py-1 font-medium border bg-blue-50 text-blue-700 border-blue-200">
                            C: {totalNutrients.carbs.toFixed(2)} g
                          </Badge>
                          <Badge className="min-w-[60px] py-1 font-medium border bg-orange-50 text-orange-700 border-orange-200">
                            F: {totalNutrients.fat.toFixed(2)} g
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="vertical-align-middle">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{recipe.prepTime + recipe.cookTime} min</span>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <Badge variant={recipe.isActive ? 'success' : 'secondary'} className="px-3 py-1 text-sm">
                        {recipe.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="font-bold bg-secondary text-sm text-white hover:bg-secondary/80"
                          onClick={() => {
                            setEditingRecipe(recipe);
                            setShowRecipeForm(true);
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-primary font-bold text-sm hover:bg-primary/80 text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(recipe?.id);
                          }}
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}


      {/* Recipe Form Dialog */}
      <Dialog open={showRecipeForm} onOpenChange={setShowRecipeForm}>
        <DialogContent className="sm:max-w-[800px] bg-white p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-6 " onSubmit={formik.handleSubmit}>
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Recipe Name</label>
                <Input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Recipe name"
                  className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-sm text-red-500 mt-1">{formik.errors.name}</div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Input
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Recipe description"
                className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-sm text-red-500 mt-1">{formik.errors.description}</div>
              )}
            </div>

            {/* Time and Servings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-blue-500 pl-2">
                Time & Servings
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Prep Time (min)</label>
                  <Input
                    type="number"
                    name="prepTime"
                    value={formik.values.prepTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min="0"  // Prevent negative values
                    className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                  {formik.touched.prepTime && formik.errors.prepTime && (
                    <div className="text-sm text-red-500 mt-1">{formik.errors.prepTime}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Cook Time (min)</label>
                  <Input
                    type="number"
                    name="cookTime"
                    value={formik.values.cookTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min="0"  // Prevent negative values
                    className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                  {formik.touched.cookTime && formik.errors.cookTime && (
                    <div className="text-sm text-red-500 mt-1">{formik.errors.cookTime}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Servings</label>
                  <Input
                    type="number"
                    name="servings"
                    value={formik.values.servings}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min="1"  // Prevent negative values and ensure at least 1 serving
                    className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                  {formik.touched.servings && formik.errors.servings && (
                    <div className="text-sm text-red-500 mt-1">{formik.errors.servings}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-4">
              {selectedIngredients.length > 0 && (
                <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-green-500 pl-2">
                  Ingredients
                </h3>
              )}

              {selectedIngredients.map((item, index) => (
                <div key={item.id} className="grid grid-cols-7 gap-2 items-end border-b">
                  {/* Ingredient Select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ingredient</label>
                    <Select
                      value={item.ingredientId}
                      onValueChange={(value) => handleIngredientChange(index, 'ingredientId', value)}>

                      <SelectTrigger className="h-10 border border-gray-200">
                        <SelectValue placeholder="Select ingredient" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {ingredients?.map((ing) => (
                          <SelectItem key={ing.id} value={ing.id}>
                            {ing.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Input */}
                  {/* <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Serving</label>
        <Input
          type="number"
          placeholder="Amount"
          value={item.baseAmount}
          min="0"
          onChange={(e) => handleIngredientChange(index, 'amount', Number(e.target.value))}
          className="h-10 border border-gray-200"
        />
      </div> */}
                  {/* Min Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Min Amount</label>
                    <Input
                      type="number"
                      value={item.minAmount}
                      min="0"
                      onChange={(e) => handleIngredientChange(index, 'minAmount', Number(e.target.value))}
                      className="h-10 border border-gray-200"
                    />
                  </div>

                  {/* Base Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Base Amount</label>
                    <Input
                      type="number"
                      value={item.baseAmount}
                      min="0"
                      onChange={(e) => handleIngredientChange(index, 'baseAmount', Number(e.target.value))}
                      className="h-10 border border-gray-200"
                    />
                  </div>

                  {/* Max Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Max Amount</label>
                    <Input
                      type="number"
                      value={item.maxAmount}
                      min="0"
                      onChange={(e) => handleIngredientChange(index, 'maxAmount', Number(e.target.value))}
                      className="h-10 border border-gray-200"
                    />
                  </div>

                  {/* Unit Select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Units</label>
                    <Select
                      value={item.unitId}
                      onValueChange={(value) => handleIngredientChange(index, 'unitId', value)}>
                      <SelectTrigger className="h-10 border border-gray-200">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {mealUnits?.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Remove Ingredient Button */}
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemoveIngredient(index)}
                    className="h-10 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remove
                  </Button>

                  {/* Nutrient Data */}
                  <table className="col-span-7 w-full">
                    {item.ingredientId && (
                      <tbody>
                        <tr className="bg-red-100">
                          {(() => {
                            const nutrientData = getIngredientNutrients(item.ingredientId);
                            return nutrientData ? (
                              <>
                                <td className="w-[200px] p-2">
                                  <strong>Calories:</strong> {nutrientData.calories || 'N/A'}
                                </td>
                                <td className="w-[200px] p-2">
                                  <strong>Protein:</strong> {nutrientData.protein || 'N/A'}
                                </td>
                                <td className="w-[200px] p-2">
                                  <strong>Fat:</strong> {nutrientData.fat || 'N/A'}
                                </td>
                                <td className="w-[200px] p-2">
                                  <strong>Carbs:</strong> {nutrientData.carbs || 'N/A'}
                                </td>
                              </>
                            ) : (
                              <td colSpan={4}>No nutrient data available</td>
                            );
                          })()}
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
              ))}

              {/* Total Nutrients */}
              {selectedIngredients.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-green-500 pl-2">
                    Total Nutrients
                  </h3>
                  <table className="w-full table-auto mt-2">
                    <thead>
                      <tr>
                        <td className="w-[100px] p-2">
                          <strong>Total Calories:</strong>
                        </td>
                        <td className="w-[100px] p-2">
                          <strong>Total Protein:</strong>
                        </td>
                        <td className="w-[100px] p-2">
                          <strong>Total Fat:</strong>
                        </td>
                        <td className="w-[100px] p-2">
                          <strong>Total Carbs:</strong>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='px-2'>{calculateTotalNutrients(selectedIngredients).calories.toFixed(1)}</td>
                        <td className='px-2'>{calculateTotalNutrients(selectedIngredients).protein.toFixed(2)}</td>
                        <td className='px-2'>{calculateTotalNutrients(selectedIngredients).fat.toFixed(2)}</td>
                        <td className='px-2'>{calculateTotalNutrients(selectedIngredients).carbs.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add Ingredient Button */}
              <Button
                type="button"
                onClick={handleAddIngredient}
                className="bg-secondary text-white hover:bg-secondary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredient
              </Button>
            </div>


            {/* Instructions */}
            <div className="space-y-4 mt-2">
              <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-orange-500 pl-2">
                Instructions
              </h3>
              <div className="space-y-3">
                {instructionSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <span className="font-medium text-gray-700 min-w-[24px]">{index + 1}.</span>
                    <Input
                      value={step.text}
                      onChange={(e) => handleInstructionChange(step.id, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                      className="flex-1 h-10 border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveInstruction(step.id)}
                      className="h-10 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={handleAddInstruction}
                className="bg-secondary text-white hover:bg-secondary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>

            {/* Form Actions */}
            <DialogFooter className="pt-6 border-t gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90"
              >
                {editingRecipe ? 'Update' : 'Create'} Recipe
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
