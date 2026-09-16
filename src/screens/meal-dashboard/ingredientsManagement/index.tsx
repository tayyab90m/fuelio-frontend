import React, { useState, useEffect } from 'react';
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
  Edit,
  Trash
} from 'lucide-react';
import { Formik, Form, Field } from "formik";
import { CreateIngredientVariable, Ingredient } from '../../../apiServices/endpoints/ingredients/types';
import { onCreateIngredient, onGetIngredients, onDeleteIngredient, onUpdateIngredient } from '../../../redux/ingredients/action';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { onGetUnits } from '../../../redux/units/action';
const toastOptions = {
  success: {
    autoClose: 5000,
    style: {
      background: '#22c55e',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
  },
  error: {
    autoClose: 5000,
    style: {
      background: '#ef4444',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
  },
};

const IngredientSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')  // Ensures the name is not empty
    .min(5, 'Name must be at least 5 characters'),  // Ensures the name has a minimum length of 2 characters

  calories: Yup.number()
    .required('Calories is required')  // Ensures calories field is required
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)) // Converts non-numeric input to null
    .min(1, 'Calories must be greater than or equal to 1'), // Ensures calories is >= 0

  protein: Yup.number()
    .required('Protein is required')  // Ensures protein field is required
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)) // Converts non-numeric input to null
    .min(1, 'Protein must be greater than or equal to 1'), // Ensures protein is >= 0

  carbs: Yup.number()
    .required('Carbs is required')  // Ensures carbs field is required
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)) // Converts non-numeric input to null
    .min(1, 'Carbs must be greater than or equal to 1'), // Ensures carbs is >= 0

  fat: Yup.number()
    .required('Fat is required')  // Ensures fat field is required
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)) // Converts non-numeric input to null
    .min(1, 'Fat must be greater than or equal to 1'), // Ensures fat is >= 0

  servingSizeAmount: Yup.number()
    .required('Serving size amount is required')  // Ensures serving size amount is required
    .min(0, 'Serving size must be greater than or equal to 1'),  // Ensures serving size is >= 0

  servingSizeUnit: Yup.string()
    .required('Serving size unit is required')  // Ensures serving size unit is required
    .min(1, 'Serving size unit is required'),  // Ensures the unit is not empty
});


export function IngredientsConfig() {
  
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { allIngredients } = useSelector((state: RootState) => {
    return state.ingredientReducer;
  });
  const [units, setUnits] = useState<Array<{ id: string, name: string }>>([]);

  const initialValues: CreateIngredientVariable = {
    name: "",
    calories: undefined,
    protein: undefined,
    fat: undefined,
    carbs: undefined,
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    soyaFree: false,
    nutFree: false,
    servingSizeAmount: 0,
    servingSizeUnit: "",
    state: undefined,
    categoryId: undefined,
    unitId: undefined
  };
  
  useEffect(() => {
    loadIngredients();
    loadUnits();
  }, []);

  const loadIngredients = async () => {
    try {
      const response = await onGetIngredients();
    } catch (error) {
      toast.error("Failed to load ingredients", toastOptions.error);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await onGetUnits();
      setUnits(response);
    } catch (error) {
      toast.error("Failed to load units", toastOptions.error);
    }
  };

  const filteredIngredients = isSearching 
    ? allIngredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allIngredients;

  const handleSearch = () => {
    setIsSearching(true);
  };

  const handleSubmit = async (values: CreateIngredientVariable, { resetForm }: any) => {
    try {
      const formData = {
        ...values,
        calories: values.calories || undefined,
        protein: values.protein || undefined,
        carbs: values.carbs || undefined,
        fat: values.fat || undefined,
        servingSizeAmount: Number(values.servingSizeAmount),
        servingSizeUnit: values.servingSizeUnit,
      };
  
      const success = editingIngredient
        ? await onUpdateIngredient({ id: editingIngredient.id, ...formData })
        : await onCreateIngredient(formData);
  
      if (success) {
        toast.success(
          `Ingredient ${editingIngredient ? 'updated' : 'created'} successfully`,
          toastOptions.success
        );
        resetForm();
        setShowForm(false);
        setEditingIngredient(null);
        setTimeout(() => {
          loadIngredients();
        }, 500);
      } else {
        toast.error(
          `Failed to ${editingIngredient ? 'update' : 'create'} ingredient`,
          toastOptions.error
        );
      }
    } catch (error) {
      toast.error("An error occurred", toastOptions.error);
    }
  };
  

  const handleDelete = async (id: string) => {
    try {
      const success = await onDeleteIngredient(id);
      if (success) {
        toast.success("Ingredient deleted successfully", toastOptions.success);
        await loadIngredients();
      } else {
        toast.error("Failed to delete ingredient", toastOptions.error);
      }
    } catch (error) {
      toast.error("An error occurred while deleting", toastOptions.error);
    }
  };


  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold">Ingredients</h1>
        <Button size="sm" className='bg-primary gap-2 font-bold text-sm text-white hover:bg-primary/80' onClick={() => {
          setEditingIngredient(null);
          setShowForm(true);
        }}>
          <Plus className="w-4 h-4" />
          Add Ingredient
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            onKeyUp={(e) => {
              // Cast the event target to HTMLInputElement
              const target = e.target as HTMLInputElement;
              setSearchTerm(target.value);
              setIsSearching(true);  // Trigger the search when a key is pressed
            }}
            className="pl-14 px-2 bg-white"
          />
        </div>
        <Button className="bg-secondary font-bold text-sm text-white hover:bg-secondary/80" variant="outline" onClick={handleSearch}>
          <Filter className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      <Card className="bg-white rounded-lg overflow-y-auto shadow-none border-none">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary align-middle">
              <TableHead className="font-bold py-4 text-sm align-middle text-white px-4">Name</TableHead>
              <TableHead className="font-bold py-4 text-sm align-middle text-white text-center">Calories</TableHead>
              <TableHead className="font-bold py-4 text-sm align-middle text-white text-center">Protein</TableHead>
              <TableHead className="font-bold py-4 text-sm align-middle text-white text-center">Carbs</TableHead>
              <TableHead className="font-bold py-4 text-sm align-middle text-white text-center">Fat</TableHead>
              <TableHead className="font-bold py-4 text-sm align-middle text-white text-center">Meal Type</TableHead>
              <TableHead className="font-bold py-4 text-sm align-middle text-white text-center">Serving Size</TableHead>
              <TableHead className="font-bold py-4 text-sm align-middle text-white text-center">Serving Unit</TableHead>
              <TableHead className="font-bold py-4 text-sm align-middle text-white text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIngredients.map((ingredient) => {
              return (
                <TableRow key={ingredient.id}>
                  <TableCell className="px-4 py-4 capitalize w-30">{ingredient.name}</TableCell>
                  <TableCell className="text-center py-4">
                    <Badge className="min-w-[70px] justify-center text-center py-1 font-medium border bg-gray-50 text-gray-700 border-gray-200">
                      {ingredient.calories || '--'} kcal
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Badge className="min-w-[70px] justify-center text-center py-1 font-medium border bg-green-50 text-green-700 border-green-200">
                      {ingredient.protein || '--'}g
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Badge className="min-w-[70px] justify-center text-center py-1 font-medium border bg-blue-50 text-blue-700 border-blue-200">
                      {ingredient.carbs || '--'}g
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4  ">
                    <Badge className="min-w-[70px] justify-center text-center py-1 font-medium border bg-orange-50 text-orange-700 border-orange-200">
                      {ingredient.fat || '--'}g
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <div className="flex justify-center items-center flex-wrap gap-1">
                      {ingredient.vegan && <Badge>Vegan</Badge>}
                      {ingredient.vegetarian && <Badge>Vegetarian</Badge>}
                      {ingredient.glutenFree && <Badge>Gluten-Free</Badge>}
                      {ingredient.soyaFree && <Badge>Soya Free</Badge>}
                      {ingredient.nutFree && <Badge>Nut Free</Badge>}

                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {ingredient.servingSizeAmount}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {ingredient.servingSizeUnit}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <div className="flex justify-center items-center gap-2">
                      <Button 
                        className="bg-secondary font-bold text-sm text-white hover:bg-secondary/80"
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setEditingIngredient(ingredient);
                          setShowForm(true);
                        }}
                        aria-label="Edit ingredient"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button className="bg-primary font-bold text-sm text-white hover:bg-primary/80" variant="ghost" size="sm" onClick={() => handleDelete(ingredient.id)}>
                        <Trash className="w-4 h-4" />
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

      <Dialog 
        open={showForm} 
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) {
            setEditingIngredient(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px] bg-white p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
            </DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={editingIngredient || initialValues}
            validationSchema={IngredientSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, setFieldValue, errors, touched }) => (
              <Form className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <Field
                      name="name"
                      placeholder="e.g., Chicken Breast"
                      className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                    />
                    {errors.name && touched.name && (
                      <div className="text-sm text-red-500 mt-1">{errors.name}</div>
                    )}
                  </div>

                  <div className="col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-blue-500 pl-2">
                      Nutritional Information
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Calories</label>
                        <Field
                          name="calories"
                          type="number"
                          className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        />
                        {errors.calories && touched.calories && (
                          <div className="text-sm text-red-500 mt-1">{errors.calories}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Protein (g)</label>
                        <Field
                          name="protein"
                          type="number"
                          className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        />
                        {errors.protein && touched.protein && (
                          <div className="text-sm text-red-500 mt-1">{errors.protein}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Carbs (g)</label>
                        <Field
                          name="carbs"
                          type="number"
                          className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        />
                        {errors.carbs && touched.carbs && (
                          <div className="text-sm text-red-500 mt-1">{errors.carbs}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Fat (g)</label>
                        <Field
                          name="fat"
                          type="number"
                          className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        />
                        {errors.fat && touched.fat && (
                          <div className="text-sm text-red-500 mt-1">{errors.fat}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-green-500 pl-2">
                      Dietary Preferences
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                        <Field type="checkbox" name="vegan" className="h-4 w-4 text-primary border-gray-200" />
                        <span className="text-sm font-medium text-gray-700">Vegan</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                        <Field type="checkbox" name="vegetarian" className="h-4 w-4 text-primary border-gray-200" />
                        <span className="text-sm font-medium text-gray-700">Vegetarian</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                        <Field type="checkbox" name="glutenFree" className="h-4 w-4 text-primary border-gray-200" />
                        <span className="text-sm font-medium text-gray-700">Gluten Free</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                        <Field type="checkbox" name="soyaFree" className="h-4 w-4 text-primary border-gray-200" />
                        <span className="text-sm font-medium text-gray-700">Soy Free</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                        <Field type="checkbox" name="nutFree" className="h-4 w-4 text-primary border-gray-200" />
                        <span className="text-sm font-medium text-gray-700">Nut Free </span>
                      </label>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-orange-500 pl-2">
                      Serving Information
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Serving Size Amount</label>
                        <Field
                          name="servingSizeAmount"
                          type="number"
                          className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        />
                        {errors.servingSizeAmount && touched.servingSizeAmount && (
                          <div className="text-sm text-red-500 mt-1">{errors.servingSizeAmount}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Serving Size Unit</label>
                        <Field
                          as="select"
                          name="servingSizeUnit"
                          className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        >
                          <option value="">Select a unit</option>
                          {units.map((unit) => (
                            <option key={unit.id} value={unit.name}>
                              {unit.name}
                            </option>
                          ))}
                        </Field>
                        {errors.servingSizeUnit && touched.servingSizeUnit && (
                          <div className="text-sm text-red-500 mt-1">{errors.servingSizeUnit}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-6 border-t gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingIngredient(null);
                    }}
                    className="border-gray-200 hover:bg-gray-50 text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    {isSubmitting ? "Saving..." : editingIngredient ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>  
    </div>
  );
}
