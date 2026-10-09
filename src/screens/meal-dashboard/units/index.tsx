import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Edit, Plus, Trash } from 'lucide-react';
import { RootState } from '../../../redux/store';
import { onGetAllUnits } from '../../../redux/meals/action';
import { onCreateUnit, onDeleteUnit, onUpdateUnit } from '../../../redux/units/action';
import { MealUnitProps } from '../../../interfaces/meal/types';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

interface UnitFormValues {
  name: string;
  short: string;
  equivalentTo: string;
  unitType: string;
  system: string;
}

const emptyValues: UnitFormValues = { name: '', short: '', equivalentTo: '', unitType: '', system: '' };

const validationSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  short: Yup.string().trim().max(10, 'Keep the short name to 10 characters or fewer'),
  equivalentTo: Yup.number()
    .transform((value, original) => (original === '' ? undefined : value))
    .typeError('Must be a number')
    .min(0, 'Cannot be negative'),
});

const inputClass =
  'h-10 px-2 w-full rounded-md border border-gray-200 focus:border-blue-300 focus:ring-blue-200';

const Units = () => {
  const { mealUnits } = useSelector((state: RootState) => state.mealsReducer);
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<MealUnitProps | null>(null);

  useEffect(() => {
    onGetAllUnits();
  }, []);

  const closeForm = () => {
    setShowForm(false);
    setEditingUnit(null);
  };

  const initialValues: UnitFormValues = editingUnit
    ? {
        name: editingUnit.name,
        short: editingUnit.short || '',
        equivalentTo: editingUnit.equivalentTo || '',
        unitType: editingUnit.unitType || '',
        system: editingUnit.system || '',
      }
    : emptyValues;

  const handleSubmit = async (values: UnitFormValues) => {
    const payload = {
      name: values.name.trim(),
      short: values.short.trim(),
      equivalentTo: values.equivalentTo === '' ? undefined : Number(values.equivalentTo),
      unitType: values.unitType,
      system: values.system,
    };
    // The actions report failures themselves (error toast) and return false;
    // keep the dialog open so the user's input isn't lost.
    const saved = editingUnit
      ? await onUpdateUnit({ id: editingUnit.id, ...payload })
      : await onCreateUnit(payload);
    if (!saved) return;
    toast.success(`Unit ${editingUnit ? 'updated' : 'created'} successfully`);
    await onGetAllUnits();
    closeForm();
  };

  const handleDelete = async (unit: MealUnitProps) => {
    if (!window.confirm(`Delete the unit "${unit.name}"?`)) return;
    if (await onDeleteUnit(unit.id)) {
      toast.success('Unit deleted successfully');
      await onGetAllUnits();
    }
  };

  const headerClass = 'px-6 py-5 text-white text-left text-base font-semibold uppercase';
  const cellClass = 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900';

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Units</h2>
        <Button
          size="sm"
          className="bg-primary gap-2 font-bold text-sm text-white hover:bg-primary/80"
          onClick={() => {
            setEditingUnit(null);
            setShowForm(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Unit
        </Button>
      </div>

      <div className="overflow-y-auto mt-4 bg-white rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-secondary">
            <tr>
              <th className={headerClass}>Name</th>
              <th className={headerClass}>Short</th>
              <th className={headerClass}>Equivalent To</th>
              <th className={headerClass}>Type</th>
              <th className={headerClass}>System</th>
              <th className={`${headerClass} text-center`}>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mealUnits && mealUnits.length > 0 ? (
              mealUnits.map((unit) => (
                <tr className="hover:bg-gray-50" key={unit.id}>
                  <td className={`${cellClass} capitalize`}>{unit.name}</td>
                  <td className={cellClass}>{unit.short}</td>
                  <td className={cellClass}>{unit.equivalentTo}</td>
                  <td className={cellClass}>{unit.unitType}</td>
                  <td className={cellClass}>{unit.system}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="font-bold bg-secondary text-sm text-white hover:bg-secondary/80"
                        onClick={() => {
                          setEditingUnit(unit);
                          setShowForm(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-primary font-bold text-sm hover:bg-primary/80 text-white"
                        onClick={() => handleDelete(unit)}
                      >
                        <Trash className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="bg-white sm:max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {editingUnit ? 'Edit Unit' : 'Add Unit'}
            </DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <Field name="name" placeholder="e.g., Gram" className={inputClass} />
                  {errors.name && touched.name && <div className="text-sm text-red-500">{errors.name}</div>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Short name</label>
                    <Field name="short" placeholder="e.g., g" className={inputClass} />
                    {errors.short && touched.short && <div className="text-sm text-red-500">{errors.short}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Equivalent to</label>
                    <Field name="equivalentTo" type="number" min="0" step="any" placeholder="e.g., 1" className={inputClass} />
                    {errors.equivalentTo && touched.equivalentTo && (
                      <div className="text-sm text-red-500">{errors.equivalentTo}</div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <Field as="select" name="unitType" className={inputClass}>
                      <option value="">Not set</option>
                      <option value="weight">Weight</option>
                      <option value="volume">Volume</option>
                      <option value="count">Count</option>
                    </Field>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">System</label>
                    <Field as="select" name="system" className={inputClass}>
                      <option value="">Not set</option>
                      <option value="metric">Metric</option>
                      <option value="imperial">Imperial</option>
                    </Field>
                  </div>
                </div>
                <DialogFooter className="pt-6 border-t gap-3">
                  <Button type="button" variant="outline" onClick={closeForm} className="border-gray-200 hover:bg-gray-50 text-gray-700">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : editingUnit ? 'Update' : 'Create'} Unit
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Units;
