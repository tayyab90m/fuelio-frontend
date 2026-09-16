import { FC, useEffect, useState, FormEvent, useMemo } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { 
  fetchCategories, 
  createCategory, 
  updateCategoryById, 
  deleteCategory 
} from '../../../redux/categories/action';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/table';
import Button from '../../../components/ui/buttons';
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
  Trash2
} from 'lucide-react';
import { CreateCategoryInput, CategoryWithDates } from '../../../apiServices/endpoints/categories/types';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Categories: FC = () => {
  const {categories,loading} = useSelector((state: RootState) => state.categories);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithDates | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const initialFormState: CreateCategoryInput = {
    name: '',
    description: '',
    sortingPriority: 0,
    proteinMin: 0,
    proteinMax: 0,
    fatMin: 0,
    fatMax: 0,
    carbsMin: 0,
    carbsMax: 0,
    minimalDailyCaloriesMen: 0,
    minimalDailyCaloriesWomen: 0,
    mealSwapEnabled: false,
    toleranceOfTotalCalories: 0,
    unit: "g_per_kg_body_weight",
    goalIds: []
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    sortingPriority: Yup.number()
    .min(1, 'Priority must be a positive number') // Ensure the priority is positive
    .integer('Priority must be an integer') // Ensure the priority is an integer
    .required('Sorting priority is required'),
    
    proteinMin: Yup.number().min(0, 'Must be positive'),
    proteinMax: Yup.number().min(0, 'Must be positive')
      .test('greater-than-min', 'Protein max must be greater than or equal to protein min', function(value) {
        return value >= this.parent.proteinMin;
      }),
    
    fatMin: Yup.number().min(0, 'Must be positive'),
    fatMax: Yup.number().min(0, 'Must be positive')
      .test('greater-than-min', 'Fat max must be greater than or equal to fat min', function(value) {
        return value >= this.parent.fatMin;
      }),
    
    carbsMin: Yup.number().min(0, 'Must be positive'),
    carbsMax: Yup.number().min(0, 'Must be positive')
      .test('greater-than-min', 'Carbs max must be greater than or equal to carbs min', function(value) {
        return value >= this.parent.carbsMin;
      }),
  
    minimalDailyCaloriesMen: Yup.number().min(0, 'Must be positive'),
    minimalDailyCaloriesWomen: Yup.number().min(0, 'Must be positive'),
    
    toleranceOfTotalCalories: Yup.number()
      .min(0, 'Must be positive')
      .max(100, 'Cannot exceed 100%'),
  });
  

  const formik = useFormik({
    initialValues: initialFormState,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingCategory) {
          await updateCategoryById({
            id: editingCategory.id,
            ...values
          });
        } else {
          await createCategory(values);
        }
        handleDialogClose();
      } catch (error) {
        toast.error('Failed to save category');
      }
    },
  });

  const filteredCategories = useMemo(() => {
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingCategory) {
      formik.setValues({
        name: editingCategory.name,
        description: editingCategory.description,
        sortingPriority: editingCategory.sortingPriority,
        proteinMin: editingCategory.proteinMin,
        proteinMax: editingCategory.proteinMax,
        fatMin: editingCategory.fatMin,
        fatMax: editingCategory.fatMax,
        carbsMin: editingCategory.carbsMin,
        carbsMax: editingCategory.carbsMax,
        minimalDailyCaloriesMen: editingCategory.minimalDailyCaloriesMen,
        minimalDailyCaloriesWomen: editingCategory.minimalDailyCaloriesWomen,
        mealSwapEnabled: editingCategory.mealSwapEnabled,
        toleranceOfTotalCalories: editingCategory.toleranceOfTotalCalories,
        unit: editingCategory.unit,
        goalIds: editingCategory?.goalIds?.map(goal => goal?.id) || []
      });
    }
  }, [editingCategory]);

  const handleDelete = async (id: string) => {
    if (id) {
      await deleteCategory(id);
    }
  };

  const handleDialogClose = () => {
    setShowCategoryForm(false);
    formik.resetForm();
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-secondary font-bold">Categories</h1>
        <Button size="sm" className='bg-primary gap-2 font-bold text-sm text-white hover:bg-primary/80' onClick={() => setShowCategoryForm(true)}>
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add Category</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <Button className='bg-secondary gap-2 font-bold text-sm text-white hover:bg-primary/80' variant="outline">
          <Filter className="w-4 h-4 " />
          <span className="text-sm">Filters</span>
        </Button>
      </div>

      {/* Categories Table */}
      <Card className="bg-white shadow-none overflow-y-auto border-none">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="font-bold text-sm py-4 px-4 text-white">Name</TableHead>
              <TableHead className="font-bold text-center py-4 px-4 text-sm text-white">Macros (g)</TableHead>
              <TableHead className="font-bold text-center py-4 px-4 text-sm text-white">Daily Calories</TableHead>
              <TableHead className="font-bold text-center py-4 px-4 text-sm text-white">Meal Swap</TableHead>
              {/* <TableHead className="font-bold text-center">Goals</TableHead> */}
              <TableHead className="font-bold text-center text-white py-4 px-4 text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="px-4">
                  <div className="text-base capitalize">{category.name}</div>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">Priority:</span>
                    <span className="font-bold text-darkGray">{category.sortingPriority}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex w-[300px] mx-auto gap-4 justify-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-600">Protein</span>
                      <Badge className="min-w-[70px] justify-center py-1.5 font-medium border bg-green-50 text-green-700 border-green-200">
                        {category.proteinMin} - {category.proteinMax}g
                      </Badge>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-600">Carbs</span>
                      <Badge className="min-w-[70px] justify-center py-1.5 font-medium border bg-blue-50 text-blue-700 border-blue-200">
                        {category.carbsMin} - {category.carbsMax}g
                      </Badge>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-600">Fats</span>
                      <Badge className="min-w-[70px] justify-center py-1.5 font-medium border bg-orange-50 text-orange-700 border-orange-200">
                        {category.fatMin} - {category.fatMax}g
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col gap-1">
                    <div>Men: {category.minimalDailyCaloriesMen} kcal</div>
                    <div>Women: {category.minimalDailyCaloriesWomen} kcal</div>
                    <div className="text-sm text-gray-500">
                      <span className="font-semibold">Tolerance: </span>
                      <span className="font-bold text-darkGray">
                        {category.toleranceOfTotalCalories}%
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={category.mealSwapEnabled ? 'success' : 'secondary'}>
                    {category.mealSwapEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </TableCell>
                {/* <TableCell className="text-center">
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(category.goalIds) && category.goalIds.map(goal => (
                      <Badge key={typeof goal === 'string' ? goal : goal.id} variant="outline">
                        {typeof goal === 'string' ? goal : goal.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell> */}
                <TableCell className="text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Button 
                      variant="ghost" 
                      className="bg-secondary gap-2 font-bold text-sm text-white hover:bg-primary/80"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(category);
                        setShowCategoryForm(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </Button>
                    <Button 
                      className="bg-primary gap-2 font-bold text-sm text-white hover:bg-primary/80"
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Category Form Dialog */}
      <Dialog open={showCategoryForm} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[700px] bg-white p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          
          <form className="space-y-6 pt-4" onSubmit={formik.handleSubmit}>
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-blue-500 pl-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category Name</label>
                  <Input 
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., Weight Loss" 
                    className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-sm text-red-500 mt-1">{formik.errors.name}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <Input 
                    name="sortingPriority"
                    type="number"
                    min="0"
                    value={formik.values.sortingPriority}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Sorting Priority" 
                    className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                  {formik.touched.sortingPriority && formik.errors.sortingPriority && (
                    <div className="text-sm text-red-500 mt-1">{formik.errors.sortingPriority}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Input 
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Category description" 
                  className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Macros Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-green-500 pl-2">
                Macro Nutrients Range
              </h3>
              <div className="grid grid-cols-3 gap-6">
                {/* Protein */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Protein (g)</label>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <Input 
                        name="proteinMin"
                        type="number" 
                        placeholder="Min" 
                        min="0"
                        value={formik.values.proteinMin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                      <div className="text-xs text-gray-500 text-center">Minimum</div>
                      {formik.touched.proteinMin && formik.errors.proteinMin && (
                        <div className="text-sm text-red-500">{formik.errors.proteinMin}</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input 
                        name="proteinMax"
                        type="number" 
                        placeholder="Max"
                        min="0"
                        value={formik.values.proteinMax}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                      <div className="text-xs text-gray-500 text-center">Maximum</div>
                      {formik.touched.proteinMax && formik.errors.proteinMax && (
                        <div className="text-sm text-red-500">{formik.errors.proteinMax}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Carbs - Similar structure to Protein */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Carbs (g)</label>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <Input 
                        name="carbsMin"
                        type="number" 
                        placeholder="Min"
                        min="0"
                        value={formik.values.carbsMin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                      <div className="text-xs text-gray-500 text-center">Minimum</div>
                      {formik.touched.carbsMin && formik.errors.carbsMin && (
                        <div className="text-sm text-red-500">{formik.errors.carbsMin}</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input 
                        name="carbsMax"
                        type="number" 
                        placeholder="Max"
                        min="0"
                        value={formik.values.carbsMax}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                      <div className="text-xs text-gray-500 text-center">Maximum</div>
                      {formik.touched.carbsMax && formik.errors.carbsMax && (
                        <div className="text-sm text-red-500">{formik.errors.carbsMax}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fats - Similar structure to Protein */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Fats (g)</label>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <Input 
                        name="fatMin"
                        type="number" 
                        placeholder="Min"
                        min="0"
                        value={formik.values.fatMin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                      <div className="text-xs text-gray-500 text-center">Minimum</div>
                      {formik.touched.fatMin && formik.errors.fatMin && (
                        <div className="text-sm text-red-500">{formik.errors.fatMin}</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input 
                        name="fatMax"
                        type="number" 
                        placeholder="Max"
                        min="1"
                        value={formik.values.fatMax}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                      <div className="text-xs text-gray-500 text-center">Maximum</div>
                      {formik.touched.fatMax && formik.errors.fatMax && (
                        <div className="text-sm text-red-500">{formik.errors.fatMax}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calories Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-orange-500 pl-2">
                Calorie Requirements
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Minimal Daily Calories (Men)</label>
                  <Input 
                    name="minimalDailyCaloriesMen"
                    type="number"
                    min="0"
                    value={formik.values.minimalDailyCaloriesMen}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., 2500"
                    className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                  {formik.touched.minimalDailyCaloriesMen && formik.errors.minimalDailyCaloriesMen && (
                    <div className="text-sm text-red-500 mt-1">{formik.errors.minimalDailyCaloriesMen}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Minimal Daily Calories (Women)</label>
                  <Input 
                    name="minimalDailyCaloriesWomen"
                    type="number"
                    min="0"
                    value={formik.values.minimalDailyCaloriesWomen}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., 2000"
                    className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                  {formik.touched.minimalDailyCaloriesWomen && formik.errors.minimalDailyCaloriesWomen && (
                    <div className="text-sm text-red-500 mt-1">{formik.errors.minimalDailyCaloriesWomen}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-purple-500 pl-2">
                Additional Settings
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tolerance of Total Calories (%)</label>
                  <Input 
                    name="toleranceOfTotalCalories"
                    type="number"
                    min="0"
                    value={formik.values.toleranceOfTotalCalories}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., 10"
                    className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                  {formik.touched.toleranceOfTotalCalories && formik.errors.toleranceOfTotalCalories && (
                    <div className="text-sm text-red-500 mt-1">{formik.errors.toleranceOfTotalCalories}</div>
                  )}
                </div>
                <div className="space-y-2 flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formik.values.mealSwapEnabled}
                      onChange={(e) => formik.setFieldValue('mealSwapEnabled', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-200 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Meal Swap</span>
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t gap-3">
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleDialogClose}
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={formik.isSubmitting}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {formik.isSubmitting ? "Saving..." : editingCategory ? 'Update' : 'Create'} Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Loading State from Redux */}
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}
    </div>
  );
};

export default Categories;