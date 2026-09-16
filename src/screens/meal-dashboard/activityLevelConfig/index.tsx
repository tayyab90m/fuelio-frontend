import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { onCreateActivityLevel, onDeleteActivityLevel, onGetAllActivityLevels, onUpdateActivityLevel } from '../../../redux/activity/action';
import { ActivityLevel } from "../../../apiServices/endpoints/activity/type";

// Components
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Edit, Plus, Trash } from "lucide-react";

// Validation Schema
const activityLevelSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  multiplier: Yup.number().required("Multiplier is required"),
  stepRange: Yup.object().shape({
    min: Yup.number().required("Minimum steps required"),
    max: Yup.number().required("Maximum steps required")
  }),
  workoutRange: Yup.object().shape({
    min: Yup.number().required("Minimum workouts required"),
    max: Yup.number().required("Maximum workouts required")
  })
});

// Initial form values
const initialValues = {
  name: "",
  multiplier: "",
  stepRange: { min: "", max: "" },
  workoutRange: { min: "", max: "" }
};

export function ActivityLevelsConfig() {
  const levels = useSelector((state: RootState) => state.activityLevels.activityLevels);
  const [editingLevel, setEditingLevel] = useState<ActivityLevel | null>(null);

  const formik = useFormik({
    initialValues,
    validationSchema: activityLevelSchema,
    onSubmit: async (values) => {
      try {
        const input = {
          ...values,
          multiplier: parseFloat(values.multiplier),
          stepRange: {
            min: parseInt(values.stepRange.min),
            max: parseInt(values.stepRange.max)
          },
          workoutRange: {
            min: parseInt(values.workoutRange.min),
            max: parseInt(values.workoutRange.max)
          }
        };

        if (editingLevel?.id) {
          await onUpdateActivityLevel({ ...input, id: editingLevel.id });
        } else {
          await onCreateActivityLevel(input);
        }
        handleCloseModal();
      } catch (error) {
      }
    }
  });

  const handleCloseModal = () => {
    setEditingLevel(null);
    formik.resetForm();
  };

  const handleDelete = async (id: string) => {
    if (id) {
     onDeleteActivityLevel(id);
    }
  };

  useEffect(() => {
    onGetAllActivityLevels();
  }, []);

  useEffect(() => {
    if (editingLevel) {
      formik.setValues({
        name: editingLevel.name || '',
        multiplier: editingLevel.multiplier?.toString() || '',
        stepRange: {
          min: editingLevel.stepRange?.min?.toString() || '',
          max: editingLevel.stepRange?.max?.toString() || '',
        },
        workoutRange: {
          min: editingLevel.workoutRange?.min?.toString() || '',
          max: editingLevel.workoutRange?.max?.toString() || '',
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingLevel]); // Remove `formik` from dependencies

  const renderRangeInputs = (
    fieldName: 'stepRange' | 'workoutRange',
    label: string,
    showWeek = false
  ) => (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input 
            type="number" 
            placeholder="Min" 
            value={formik.values[fieldName].min}
            onChange={(e) => formik.setFieldValue(`${fieldName}.min`, e.target.value)}
            className="h-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-center"
          />
          <span className="text-xs text-gray-500 mt-1 block">Minimum</span>
        {formik.errors.stepRange?.min && formik.touched.stepRange?.min && (
          <div className="text-red-500 text-sm">{formik.errors.stepRange?.min}</div>
        )}
        </div>
        <div className="flex-1">
          <Input 
            type="number" 
            placeholder="Max" 
            value={formik.values[fieldName].max}
            onChange={(e) => formik.setFieldValue(`${fieldName}.max`, e.target.value)}
            className="h-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-center"
          />
          <span className="text-xs text-gray-500 mt-1 block">Maximum</span>
        {formik.errors.workoutRange?.min && formik.touched.workoutRange?.min && (
  <div className="text-red-500 text-sm">{formik.errors.workoutRange?.min}</div>
)}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex mb-4 justify-between items-center">
        <h1 className="text-2xl font-bold">Activity Levels</h1>
        <Button size="sm" className='bg-primary gap-2 font-bold text-sm text-white hover:bg-primary/80' onClick={() => setEditingLevel({} as ActivityLevel)}>
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add Level</span>
        </Button>
      </div>

      <Card className="bg-white shadow-none border-none overflow-y-auto">
        <Table>
          <TableHeader className="bg-secondary text-white">
            <TableRow>
              <TableHead className="px-4 py-4 text-sm font-bold">Name</TableHead>
              <TableHead className="text-center text-sm font-bold">Multiplier</TableHead>
              <TableHead className="text-center text-sm font-bold">Step Range</TableHead>
              <TableHead className="text-center text-sm font-bold">Workout Range</TableHead>
              <TableHead className="text-center text-sm font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levels.map((level) => (
              <TableRow key={level.id}>
                <TableCell className="capitalize font-semibold px-4 text-sm">{level.name}</TableCell>
                <TableCell className="text-center text-sm">{level.multiplier}</TableCell>
                <TableCell className="text-center text-sm">
                  {level.stepRange ? `${level.stepRange.min} - ${level.stepRange.max}` : 'N/A'}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {level.workoutRange ? `${level.workoutRange.min} - ${level.workoutRange.max}/week` : 'N/A'}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-2 justify-center">
                    <Button
                    className="bg-secondary font-bold text-sm text-white hover:bg-secondary/80"
                      size="sm"
                    variant="ghost" onClick={() => setEditingLevel(level)}>
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost" 
                      className="bg-primary font-bold text-sm text-white hover:bg-primary/80"
                      onClick={() => handleDelete(level.id)}
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

      <Dialog open={!!editingLevel} onOpenChange={handleCloseModal}>
        <DialogContent className="bg-white sm:max-w-[500px] p-6">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {editingLevel?.id ? 'Edit Activity Level' : 'Add Activity Level'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Level Name</label>
                <Input 
                  {...formik.getFieldProps('name')}
                  placeholder="e.g., Sedentary" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Activity Multiplier</label>
                <Input
                  type="number"
                  step="0.1"
                  {...formik.getFieldProps('multiplier')}
                  placeholder="e.g., 1.2"
                />
                {formik.errors.multiplier && formik.touched.multiplier && (
                  <div className="text-red-500 text-sm">{formik.errors.multiplier}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-blue-500 pl-2">
                    Daily Steps Range
                  </h3>
                  {renderRangeInputs('stepRange', '')}
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 border-l-2 border-green-500 pl-2">
                    Weekly Workouts Range
                  </h3>
                  {renderRangeInputs('workoutRange', '')}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t gap-3">
              <Button 
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
                {editingLevel?.id ? 'Update' : 'Create'} Level
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
