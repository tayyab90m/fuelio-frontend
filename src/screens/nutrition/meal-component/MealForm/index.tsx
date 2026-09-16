import { Formik, Field, Form } from "formik";
import Button from "../../../../components/ui/buttons";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog";
import { mealValidationSchema } from "../../../../utils/validation/meals/validation";
import DropdownFilter from "../dropdownFilter";

const MealForm = ({ showModal, handleCloseModal, handleSubmit, editingMeal, categories, allGeneralTypes, recipes }) => {
  return (
    <Dialog open={showModal} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[700px] bg-white p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {editingMeal ? "Edit Meal" : "Add New Meal"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            name: editingMeal?.name || "",
            description: editingMeal?.description || "",
            categoryIds: editingMeal?.categories?.map((c) => c.id) || [],
            generalTypeIds: editingMeal?.generalTypes?.map((t) => t.id) || [],
            recipeIds: editingMeal?.recipes?.map((r) => r.id) || []
          }}
          validationSchema={mealValidationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6 pt-4">
              <DropdownFilter
                label="Categories"
                items={categories}
                selectedItems={values.categoryIds || []}
                setSelectedItems={(val) => setFieldValue("categoryIds", val)}
              />
              <DropdownFilter
                label="Meal Types"
                items={allGeneralTypes}
                selectedItems={values.generalTypeIds || []}
                setSelectedItems={(val) => setFieldValue("generalTypeIds", val)}
              />
              <DropdownFilter
                label="Recipes"
                items={recipes}
                selectedItems={values.recipeIds || []}
                setSelectedItems={(val) => setFieldValue("recipeIds", val)}
              />
            </Form>
          )}
        </Formik>

      </DialogContent>
    </Dialog>
  );
};

export default MealForm;