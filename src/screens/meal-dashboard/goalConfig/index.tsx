import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/table";
import { Goal } from "../../../apiServices/endpoints/goals/types";
import { Formik, Field, Form } from "formik";
import { onCreateGoals, onGetAllGoals, onDeleteGoal, onToggleGoalState, onUpdateGoal } from "../../../redux/goals/action";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { clearGoalError } from "../../../redux/goals/reducer";
import { store } from "../../../redux/store";
import { Edit, Plus, Trash } from "lucide-react";
import { Switch } from "../../../components/ui/switch";
import * as Yup from 'yup';
export function GoalsConfig() {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const {goals, error} = useSelector((state:RootState)=>state.goalsReducer);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Goal name is required"),
    calorieAdjustment: Yup.object().shape({
      type: Yup.string().required("Adjustment type is required"),
      percentage: Yup.number()
        .min(0, "Adjustment percentage cannot be negative")
        .required("Adjustment percentage is required")
    }),
    macroRatios: Yup.object().shape({
      protein: Yup.number()
        .min(0, "Protein (g/kg) cannot be negative")
        .required("Protein is required"),
      fats: Yup.number()
        .min(0, "Fats percentage cannot be negative")
        .required("Fats percentage is required"),
      carbs: Yup.number()
        .min(0, "Carbs percentage cannot be negative")
        .required("Carbs percentage is required")
    }),
    state: Yup.string().required("Status is required")
  });

  useEffect(() => {
    onGetAllGoals()
  }, []);

  useEffect(() => {
    if (!error && showModal) {
      setShowModal(false);
    }
  }, [error, goals]);

  const initialValues: Goal = {
    name: "",
    description: "",
    calorieAdjustment: {
      type: "deficit",
      percentage: null,
    },
    macroRatios: {
      protein: null,
      fats: null,
      carbs: null,
    },
    state: 'unpublished'
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    store.dispatch(clearGoalError());
  };

  const handleDeleteGoal = (id: string) => {
    
      onDeleteGoal(id);
  };

  const handleToggleState = (id: string, currentState: string) => {
    onToggleGoalState(id, currentState);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex mb-4 justify-between items-center">
        <h1 className="text-2xl font-bold">Goals Configuration</h1>
        <Button size="sm" className='bg-primary gap-2 font-bold text-sm text-white hover:bg-primary/80' onClick={handleAddGoal}>
        <Plus className="w-4 h-4" />
        Add Goal
        </Button>
      </div>
  <Card className="bg-white shadow-none border-none overflow-y-auto">
  <Table>
    <TableHeader>
      <TableRow className="bg-secondary text-white">
        <TableHead className="font-bold text-sm py-4 px-4">Name</TableHead>
        <TableHead className="font-bold text-sm text-center">Calorie Adjustment</TableHead>
        <TableHead className="font-bold text-sm text-center">Adjustment Percentage</TableHead>
        <TableHead className="font-bold text-sm text-center">Protein (g/kg)</TableHead>
        <TableHead className="font-bold text-sm text-center">Fats (%)</TableHead>
        <TableHead className="font-bold text-sm text-center">Carbs (%)</TableHead>
        <TableHead className="font-bold text-sm text-center">Status</TableHead>
        <TableHead className="font-bold text-sm text-center">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {goals?.map((goal) => (
        <TableRow key={goal.id}>
          <TableCell className="capitalize font-semibold px-4">{goal.name}</TableCell>
          <TableCell className="text-center capitalize">
            {goal.calorieAdjustment.type} 
          </TableCell>
          <TableCell className="text-center">
            {goal.calorieAdjustment.percentage}%
          </TableCell>
          <TableCell className="text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
              {goal.macroRatios.protein}g/kg
            </span>
          </TableCell>
          <TableCell className="text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200">
              {goal.macroRatios.fats}%
            </span>
          </TableCell>
          <TableCell className="text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {goal.macroRatios.carbs}%
            </span>
          </TableCell>
          <TableCell className="text-center w-[100px]">
          <div className="flex flex-col items-center justify-center gap-2">
					<Switch
						checked={goal.state === 'published'}
						onCheckedChange={() => handleToggleState(goal.id, goal.state || 'unpublished')}
						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
							${goal.state === 'published' ? 'bg-gray' : 'bg-primary'}`}

					/>
					<span className="text-sm font-medium">
						{goal.state || 'unpublished'}
					</span>
				</div>
          </TableCell>
          <TableCell>
            <div className="flex gap-2 justify-center">
              <Button 
                size="sm"
                variant="ghost" 
                className="font-bold bg-secondary text-sm text-white hover:bg-secondary/80"
                onClick={() => handleEditGoal(goal)}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button 
                size="sm"
                variant="ghost" 
                className="bg-primary font-bold text-sm hover:bg-primary/80 text-white"
                onClick={() => goal.id && handleDeleteGoal(goal.id)}
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
</Card>


      {/* Goal Edit Modal */}
      <Dialog open={showModal} onOpenChange={handleCloseModal}>
        <DialogContent className="bg-white sm:max-w-[500px] p-6">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {editingGoal?.id ? 'Edit Goal' : 'Add Goal'}
            </DialogTitle>
          </DialogHeader>
          <Formik
  initialValues={editingGoal || initialValues}
  enableReinitialize={true}
  validationSchema={validationSchema}  
  onSubmit={async (values, { setSubmitting }) => {
    try {
      if (editingGoal?.id) {
        await onUpdateGoal({ ...values, id: editingGoal.id });
      } else {
        await onCreateGoals(values);
      }
      if (!error) {
        setShowModal(false);
        setEditingGoal(null);
      }
    } finally {
      setSubmitting(false);
    }
  }}>
  {({ errors, touched, setFieldValue, isSubmitting }) => (
    <Form className="space-y-6 pt-4">
      {/* Goal Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">Goal Name</label>
        <Field
          name="name"
          className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
          placeholder="e.g., Fat Loss"
        />
        {errors.name && touched.name && <div className="text-sm text-red-500 mt-1">{errors.name}</div>}
      </div>

      {/* Calorie Adjustment Type */}
      <div className="space-y-2">
        <label htmlFor="calorieAdjustment.type" className="text-sm font-medium text-gray-700">Adjustment Type</label>
        <Field
          as="select"
          name="calorieAdjustment.type"
          className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
        >
          <option value="deficit">Deficit</option>
          <option value="surplus">Surplus</option>
          <option value="maintenance">Maintenance</option>
        </Field>
        {errors.calorieAdjustment?.type && touched.calorieAdjustment?.type && (
          <div className="text-sm text-red-500 mt-1">{errors.calorieAdjustment.type}</div>
        )}
      </div>

      {/* Calorie Adjustment Percentage */}
      <div className="space-y-2">
        <label htmlFor="calorieAdjustment.percentage" className="text-sm font-medium text-gray-700">Adjustment %</label>
        <Field
          name="calorieAdjustment.percentage"
          type="number"
          className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
          placeholder="e.g., 20"
        />
        {errors.calorieAdjustment?.percentage && touched.calorieAdjustment?.percentage && (
          <div className="text-sm text-red-500 mt-1">{errors.calorieAdjustment.percentage}</div>
        )}
      </div>

      {/* Macro Distribution */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-blue-500 pl-2">
          Macro Distribution
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="macroRatios.protein" className="text-sm font-medium text-gray-700">Protein (g/kg)</label>
            <Field
              name="macroRatios.protein"
              type="number"
              className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              placeholder="e.g., 2.2"
            />
            {errors.macroRatios?.protein && touched.macroRatios?.protein && (
              <div className="text-sm text-red-500 mt-1">{errors.macroRatios.protein}</div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="macroRatios.fats" className="text-sm font-medium text-gray-700">Fats (%)</label>
            <Field
              name="macroRatios.fats"
              type="number"
              className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              placeholder="e.g., 25"
            />
            {errors.macroRatios?.fats && touched.macroRatios?.fats && (
              <div className="text-sm text-red-500 mt-1">{errors.macroRatios.fats}</div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="macroRatios.carbs" className="text-sm font-medium text-gray-700">Carbs (%)</label>
            <Field
              name="macroRatios.carbs"
              type="number"
              className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              placeholder="e.g., 45"
            />
            {errors.macroRatios?.carbs && touched.macroRatios?.carbs && (
              <div className="text-sm text-red-500 mt-1">{errors.macroRatios.carbs}</div>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label htmlFor="state" className="text-sm font-medium text-gray-700">Status</label>
        <Field
          as="select"
          name="state"
          className="h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200"
        >
          <option value="unpublished">Unpublished</option>
          <option value="published">Published</option>
        </Field>
        {errors.state && touched.state && (
          <div className="text-sm text-red-500 mt-1">{errors.state}</div>
        )}
      </div>

      {/* Error message if any */}
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

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
          disabled={isSubmitting}
          className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : editingGoal?.id ? "Update" : "Create"} Goal
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
