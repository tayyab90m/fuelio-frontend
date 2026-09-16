import { useState, useEffect, useRef } from 'react';
import { Input } from "../../../components/ui/input";

import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Checkbox } from "../../../components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { Plus, Search, X, Layers2, ChevronsUpDown, Soup, LeafyGreen, Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { onGetAllMeals, onCreateMeal, onUpdateMeal, onDeleteMeal, onFilterMeals } from '../../../redux/mealFilter/action';
import { Meal } from '../../../apiServices/endpoints/mealsFilter/types';
import { fetchCategories } from '../../../redux/categories/action';
import { onMountAllMealTypes } from '../../../redux/meals/action';
import { UpdateMealInput, UpdateMealInputData } from '../../../apiServices/endpoints/mealsFilter/types';
import { onGetAllRecipes } from '../../../redux/recipes/action';
import { mealValidationSchema } from '../../../utils/validation/meals/validation';
import { onGetIngredients } from '../../../redux/ingredients/action';
import { toast } from 'react-toastify';
import MealForm from '../meal-component/MealForm';

function MealFilter() {
  const dispatch = useDispatch();
  const { meals, loading } = useSelector((state: RootState) => state.mealFilter);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { allGeneralTypes } = useSelector((state: RootState) => state.mealsReducer);
  const { recipes } = useSelector((state: RootState) => state.recipes);
  const { allIngredients } = useSelector((state: RootState) => state.ingredientReducer);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [openMealTypes, setOpenMealTypes] = useState(false);
  const [openIngredients, setOpenIngredients] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // Track which dropdown is open
  const categoriesDropdownRef = useRef(null);
  const mealTypesDropdownRef = useRef(null);
  const recipesDropdownRef = useRef(null);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node) &&
        mealTypesDropdownRef.current && !mealTypesDropdownRef.current.contains(event.target as Node) &&
        recipesDropdownRef.current && !recipesDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null); // Close all dropdowns when clicking outside
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName: string) => {
    // If the clicked dropdown is already open, close it, else open it and close others
    setOpenDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMealTypes = allGeneralTypes.filter((mealType) =>
    mealType.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIngredients = allIngredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const dropdownCategoryRef = useRef(null);
  const dropdownMealTypesRef = useRef(null);
  const dropdownIngredientsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (dropdownCategoryRef.current && !dropdownCategoryRef.current.contains(event.target)) &&
        (dropdownMealTypesRef.current && !dropdownMealTypesRef.current.contains(event.target)) &&
        (dropdownIngredientsRef.current && !dropdownIngredientsRef.current.contains(event.target))
      ) {
        setOpenCategory(false);
        setOpenMealTypes(false);
        setOpenIngredients(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddMeal = () => {
    setEditingMeal(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMeal(null);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setShowModal(true);
  };

  const handleSearch = () => {
    const filters = {
      search: searchText,
      categories: selectedCategories,
      mealTypes: selectedMealTypes,
      ingredients: selectedIngredients
    };

    onFilterMeals(filters);
  };

  const handleClearAll = () => {
    setSearchText('');
    setSelectedCategories([]);
    setSelectedMealTypes([]);
    setSelectedIngredients([]);
    onGetAllMeals(); // Remove dispatch
  };

  const handleDelete = (mealId: string) => {
    onDeleteMeal(mealId);
  };

  useEffect(() => {
    onGetAllMeals();
    fetchCategories();
    onMountAllMealTypes();
    onGetAllRecipes();
    onGetIngredients();
  }, []);


  const handleSubmit = async (values: any, { resetForm }: any) => {
    function calculateTotalNutrients(recipes, selectedIds) {
      const matchedRecipes = recipes.filter(recipe => selectedIds.includes(recipe.id));
      const totalNutrients = matchedRecipes.reduce((acc, recipe) => {
          acc.calories += recipe.calories || 0;
          acc.protein += recipe.protein || 0;
          acc.carbs += recipe.carbs || 0;
          acc.fat += recipe.fat || 0;
          return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
      return totalNutrients;
  }
  const totalNutrients = calculateTotalNutrients(recipes, values.recipeIds);
    try {
      if (editingMeal) {
        const updateInput: UpdateMealInputData = {
          id: editingMeal.id,
          name: values.name,
          description: values.description,
          categoryIds: values.categoryIds,
          generalTypeIds: values.generalTypeIds,
          recipeIds: values.recipeIds,
          calories: totalNutrients?.calories,
          protein: totalNutrients?.protein,
          carbs: totalNutrients?.carbs,
          fat: totalNutrients?.fat,
        };

        // Call the API to update the meal
        await onUpdateMeal(updateInput);

        // Show success toast after successful update
        toast.success('Meal updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // Call the API to create a new meal
        await onCreateMeal({
          name: values.name,
          description: values.description,
          categoryIds: values.categoryIds,
          generalTypeIds: values.generalTypeIds,
          recipeIds: values.recipeIds,
          calories: totalNutrients?.calories,
          protein: totalNutrients?.protein,
          carbs: totalNutrients?.carbs,
          fat: totalNutrients?.fat,
        });

        // Show success toast after successful creation
        toast.success('Meal created successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
      }

      // Close the modal and reset the form after successful submission
      handleCloseModal();
      resetForm();
    } catch (error) {
      // Show error toast if something goes wrong
      toast.error('Something went wrong. Please try again!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });

    }
  };



  return (
    <div className="min-h-screen">
      <div className="mx-auto ">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Meals</h1>
          <Button
            className="bg-secondary font-bold text-sm text-white hover:bg-secondary/80"
            onClick={handleAddMeal}
          >
            <Plus className="w-4 h-4" />
            Add Meal
          </Button>
        </div>
        <div className="flex pt-4 pb-6 items-center gap-2 relative">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#e41823]" />
            <Input
              className="pl-9 bg-white border-red-200 focus:border-[#e41823] transition-colors"
              placeholder="Search meals..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Button
            className="bg-primary font-bold text-white hover:bg-primary/80 transition-all duration-300"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
        <Card className="bg-white mb-5 shadow-lg border-none">
          <CardHeader className=" py-3 bg-secondary text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold text-white">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className='grid grid-cols-2 gap-6'>
              <Card className="space-y-4 p-4 border-2 cursor-pointer border-primary/20 hover:border-primary transition-colors">
                <div className="flex items-center gap-2">
                  <Layers2 className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-semibold text-secondary">Category</h3>
                </div>
                <div className="space-y-2" ref={dropdownCategoryRef}>
                  <label className="text-sm font-medium text-gray-700">Categories</label>
                  <div className="relative">
                    <button
                      onClick={() => setOpenCategory(!openCategory)}
                      className="w-full justify-between h-10 border border-gray-200 hover:bg-gray-50 flex items-center"
                    >
                      {selectedCategories.length === 0
                        ? 'Select categories...'
                        : `${selectedCategories.length} selected`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>

                    {openCategory && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                        <div className="p-2">
                          <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 px-3 border border-gray-200 rounded-md mb-2"
                          />
                          <div className="max-h-[200px] overflow-y-auto">
                            {filteredCategories.length === 0 ? (
                              <div className="p-2 text-center text-gray-500">No category found.</div>
                            ) : (
                              filteredCategories.map((category) => (
                                <label
                                  key={category.id}
                                  className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={() => {
                                      setSelectedCategories((prevSelected) =>
                                        prevSelected.includes(category.name)
                                          ? prevSelected.filter((c) => c !== category.name)
                                          : [...prevSelected, category.name]
                                      );
                                    }}
                                    className="mr-2 border border-gray-200"
                                  />
                                  {category.name}
                                </label>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedCategories.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {selectedCategories.map((categoryName) => {
                        const category = categories.find((cat) => cat.name === categoryName);
                        return (
                          <span
                            key={categoryName}
                            className="px-2 py-1 gap-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full"
                          >
                            {category?.name}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedCategories(
                                  selectedCategories.filter((cat) => cat !== categoryName)
                                );
                              }}
                              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>

              <Card className="space-y-4 p-4 cursor-pointer border-2 border-primary/20 hover:border-primary transition-colors">
                <div className="flex items-center gap-2">
                  <Soup className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-semibold text-secondary">Meal Types</h3>
                </div>
                <div className="space-y-2" ref={dropdownMealTypesRef}>
                  <label className="text-sm font-medium text-gray-700">Meal Types</label>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMealTypes(!openMealTypes)}
                      className="w-full justify-between h-10 border border-gray-200 hover:bg-gray-50 flex items-center"
                    >
                      {selectedMealTypes.length === 0
                        ? 'Select meal types...'
                        : `${selectedMealTypes.length} selected`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>

                    {openMealTypes && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                        <div className="p-2">
                          <input
                            type="text"
                            placeholder="Search meal types..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 px-3 border border-gray-200 rounded-md mb-2"
                          />
                          <div className="max-h-[200px] overflow-y-auto">
                            {filteredMealTypes.length === 0 ? (
                              <div className="p-2 text-center text-gray-500">No meal type found.</div>
                            ) : (
                              filteredMealTypes.map((type) => (
                                <label
                                  key={type.id}
                                  className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedMealTypes.includes(type.id)}
                                    onChange={() => {
                                      setSelectedMealTypes((prevSelected) =>
                                        prevSelected.includes(type.id)
                                          ? prevSelected.filter((t) => t !== type.id)
                                          : [...prevSelected, type.id]
                                      );
                                    }}
                                    className="mr-2 border border-gray-200"
                                  />
                                  {type.name}
                                </label>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedMealTypes.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {selectedMealTypes.map((mealTypeId) => {
                        const mealType = allGeneralTypes.find((type) => type.id === mealTypeId);

                        // Check if the selected meal type is "snack"
                        if (mealType?.name === "Snacks") {
                          return (
                            <div key={mealTypeId} className="space-y-2 mt-2">
                              <label className="text-sm font-medium text-gray-700">Snack Type</label>
                              <div className="relative">
                                <div className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    // checked={selectedSnackTypes.includes('sweet')}
                                    // onChange={() => {
                                    //   setSelectedSnackTypes((prevSelected) =>
                                    //     prevSelected.includes('sweet')
                                    //       ? prevSelected.filter((s) => s !== 'sweet')
                                    //       : [...prevSelected, 'sweet']
                                    //   );
                                    // }}
                                    className="mr-2 border border-gray-200"
                                  />
                                  Sweet
                                </div>
                                <div className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    // checked={selectedSnackTypes.includes('savoury')}
                                    // onChange={() => {
                                    //   setSelectedSnackTypes((prevSelected) =>
                                    //     prevSelected.includes('savoury')
                                    //       ? prevSelected.filter((s) => s !== 'savoury')
                                    //       : [...prevSelected, 'savoury']
                                    //   );
                                    // }}
                                    className="mr-2 border border-gray-200"
                                  />
                                  Savoury
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <span
                            key={mealTypeId}
                            className="px-2 py-1 gap-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full"
                          >
                            {mealType?.name}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedMealTypes(
                                  selectedMealTypes.filter((id) => id !== mealTypeId)
                                );
                              }}
                              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>


              <Card className="space-y-4 cursor-pointer p-4 border-2 border-primary/20 hover:border-primary transition-colors">
                <div className="flex items-center gap-2">
                  <LeafyGreen className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-semibold text-secondary">Ingredients</h3>
                </div>
                <div className="space-y-2" ref={dropdownIngredientsRef}>
                  <div className="relative">
                    <button
                      onClick={() => setOpenIngredients(!openIngredients)}
                      className="w-full justify-between h-10 border border-gray-200 hover:bg-gray-50 flex items-center"
                    >
                      {selectedIngredients.length === 0
                        ? 'Select ingredients...'
                        : `${selectedIngredients.length} selected`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>

                    {openIngredients && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                        <div className="p-2">
                          <input
                            type="text"
                            placeholder="Search ingredients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 px-3 border border-gray-200 rounded-md mb-2"
                          />
                          <div className="max-h-[200px] overflow-y-auto">
                            {filteredIngredients.length === 0 ? (
                              <div className="p-2 text-center text-gray-500">No ingredient found.</div>
                            ) : (
                              filteredIngredients.map((ingredient) => (
                                <label
                                  key={ingredient.id}
                                  className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedIngredients.includes(ingredient.id)}
                                    onChange={() => {
                                      setSelectedIngredients((prevSelected) =>
                                        prevSelected.includes(ingredient.id)
                                          ? prevSelected.filter((i) => i !== ingredient.id)
                                          : [...prevSelected, ingredient.id]
                                      );
                                    }}
                                    className="mr-2 border border-gray-200"
                                  />
                                  {ingredient.name}
                                </label>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedIngredients.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {selectedIngredients.map((ingredientId) => {
                        const ingredient = allIngredients.find((ing) => ing.id === ingredientId);
                        return (
                          <span
                            key={ingredientId}
                            className="px-2 py-1 gap-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full"
                          >
                            {ingredient?.name}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedIngredients(
                                  selectedIngredients.filter((id) => id !== ingredientId)
                                );
                              }}
                              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                className="bg-transparent text-white font-bold bg-secondary hover:bg-secondary/80 hover:text-white"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
              <Button
                className="bg-primary font-bold text-white hover:bg-primary/80"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg overflow-y-auto rounded-lg border-none">
          <CardContent className="p-0 ">
            <Table>
              <TableHeader className="bg-secondary text-white">
                <TableRow>
                  {/* <TableHead className="w-12 pl-5 py-5">
                    <Checkbox />
                  </TableHead> */}
                  <TableHead className="font-semibold py-5 text-[16px]">Name</TableHead>
                  <TableHead className="font-semibold text-[16px]">Types</TableHead>
                  <TableHead className="font-semibold text-[16px]">Categories</TableHead>
                  <TableHead className="font-semibold text-[16px]">Recipes</TableHead>
                  <TableHead className="font-semibold text-[16px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meals.map((meal) => (
                  <TableRow key={meal.id}>
                    {/* <TableCell className="pl-5 py-5">
                      <Checkbox />
                    </TableCell> */}
                    <TableCell className="capitalize text-sm font-semibold text-secondary">{meal.name}</TableCell>
                    <TableCell>
                      <div className="flex capitalize gap-1 flex-wrap">
                        {meal.generalTypes.map((type) => (
                          <Badge key={type.id} variant="outline">
                            {type.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {meal.categories.map((category) => (
                          <Badge key={category.id} variant="secondary">
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {meal.recipes.map((recipe) => (
                          <Badge key={recipe.id} variant="secondary">
                            {recipe.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-bold bg-secondary text-sm text-white hover:bg-secondary/80"
                          onClick={() => {
                            setEditingMeal(meal);
                            setShowModal(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-primary font-bold text-sm text-white"
                          onClick={() => handleDelete(meal.id)}
                        >
                          <Trash className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Dialog open={showModal} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[700px] bg-white p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-xl font-semibold text-gray-800">
                {editingMeal ? 'Edit Meal' : 'Add New Meal'}
              </DialogTitle>
            </DialogHeader>

            <Formik
              initialValues={{
                name: editingMeal?.name || '',
                description: editingMeal?.description || '',
                categoryIds: editingMeal?.categories?.map(c => c.id) || [],
                generalTypeIds: editingMeal?.generalTypes?.map(t => t.id) || [],
                recipeIds: editingMeal?.recipes?.map(r => r.id) || []
              }}
              validationSchema={mealValidationSchema}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, errors, touched }) => (
                <Form className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-blue-500 pl-2">
                      Basic Information
                    </h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Meal Name</label>
                      <Field
                        name="name"
                        as={Input}
                        placeholder="Enter meal name"
                        className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                      {touched.name && errors.name && (
                        <div className="text-sm text-red-500 mt-1">{errors.name as string}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Field
                        name="description"
                        as={Input}
                        placeholder="Enter meal description"
                        className="h-10 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                      />
                      {touched.description && errors.description && (
                        <div className="text-sm text-red-500 mt-1">{errors.description as string}</div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Categories</label>
                    <div className="relative" ref={categoriesDropdownRef}>
                      <button
                        type="button"
                        onClick={() => toggleDropdown('categories')}
                        className="w-full h-10 border border-gray-200 rounded-md flex justify-between items-center px-4 hover:border-blue-300 hover:text-blue-600"
                      >
                        {values.categoryIds.length === 0
                          ? "Select categories..."
                          : `${values.categoryIds.length} selected`}
                      </button>
                      {values.categoryIds.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {values.categoryIds.map(id => {
                            const category = categories.find(cat => cat.id === id);
                            return (
                              <span key={id} className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                                {category?.name}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {openDropdown === 'categories' && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          <div className="space-y-2 p-2">
                            {categories.map((category) => (
                              <div key={category.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`checkbox-${category.id}`}
                                  checked={values.categoryIds.includes(category.id)}
                                  onChange={() => {
                                    const newValue = values.categoryIds.includes(category.id)
                                      ? values.categoryIds.filter(id => id !== category.id)
                                      : [...values.categoryIds, category.id];
                                    setFieldValue('categoryIds', newValue);
                                  }}
                                  className="mr-2"
                                />
                                <label htmlFor={`checkbox-${category.id}`} className="text-sm text-gray-700">
                                  {category.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {touched.categoryIds && errors.categoryIds && (
                      <div className="text-sm text-red-500 mt-1">{errors.categoryIds as string}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Meal Types</label>
                    <div className="relative" ref={mealTypesDropdownRef}>
                      <button
                        type="button"
                        onClick={() => toggleDropdown('mealTypes')}
                        className="w-full h-10 border border-gray-200 rounded-md flex justify-between items-center px-4 hover:border-blue-300 hover:text-blue-600"
                      >
                        {values.generalTypeIds.length === 0
                          ? "Select meal types..."
                          : `${values.generalTypeIds.length} selected`}
                      </button>
                      {values.generalTypeIds.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {values.generalTypeIds.map(id => {
                            const type = allGeneralTypes.find(t => t.id === id);
                            return (
                              <span key={id} className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                                {type?.name}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {openDropdown === 'mealTypes' && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          <div className="space-y-2 p-2">
                            {allGeneralTypes.map((type) => (
                              <div key={type.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`checkbox-${type.id}`}
                                  checked={values.generalTypeIds.includes(type.id)}
                                  onChange={() => {
                                    const newValue = values.generalTypeIds.includes(type.id)
                                      ? values.generalTypeIds.filter(id => id !== type.id)
                                      : [...values.generalTypeIds, type.id];
                                    setFieldValue('generalTypeIds', newValue);
                                  }}
                                  className="mr-2"
                                />
                                <label htmlFor={`checkbox-${type.id}`} className="text-sm text-gray-700">
                                  {type.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {touched.generalTypeIds && errors.generalTypeIds && (
                      <div className="text-sm text-red-500 mt-1">{errors.generalTypeIds as string}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Recipes</label>
                    <div className="relative" ref={recipesDropdownRef}>
                      <button
                        type="button"
                        onClick={() => toggleDropdown('recipes')}
                        className="w-full h-10 border border-gray-200 rounded-md flex justify-between items-center px-4 hover:border-blue-300 hover:text-blue-600"
                      >
                        {values.recipeIds.length === 0
                          ? "Select recipes..."
                          : `${values.recipeIds.length} selected`}
                      </button>

                      {values.recipeIds.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {values.recipeIds.map(id => {
                            const recipe = recipes.find(r => r.id === id);
                            return (
                              <span key={id} className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                                {recipe?.name}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {openDropdown === 'recipes' && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          <div className="space-y-2 p-2">
                            {recipes.map((recipe) => (
                              <div key={recipe.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`checkbox-${recipe.id}`}
                                  checked={values.recipeIds.includes(recipe.id)}
                                  onChange={() => {
                                    const newValue = values.recipeIds.includes(recipe.id)
                                      ? values.recipeIds.filter(id => id !== recipe.id)
                                      : [...values.recipeIds, recipe.id];
                                    setFieldValue('recipeIds', newValue);
                                  }}
                                  className="mr-2"
                                />
                                <label htmlFor={`checkbox-${recipe.id}`} className="text-sm text-gray-700">
                                  {recipe.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {touched.recipeIds && errors.recipeIds && (
                      <div className="text-sm text-red-500 mt-1">{errors.recipeIds as string}</div>
                    )}
                  </div>

                  <DialogFooter className="pt-6 border-t gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseModal}
                      className="border-gray-200 hover:bg-gray-50 text-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      {editingMeal ? 'Update' : 'Create'} Meal
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>


      </div>
    </div>
  );
}

export default MealFilter;