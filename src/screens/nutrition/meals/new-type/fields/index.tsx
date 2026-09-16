import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Field, useFormikContext, FormikProps } from 'formik';
import { useNavigate, useParams } from 'react-router';
import { CreateGeneralMealTypeBodyParams } from '../../../../../apiServices/endpoints/meal/types';
import { RootState } from '../../../../../redux/store';
import { MealTypesProps } from '../../../../../interfaces/meal/types';
import moment from 'moment';

const InputFields: FC<FormikProps<CreateGeneralMealTypeBodyParams>> = ({ errors, touched, handleSubmit }) => {
  const { id } = useParams<{ id: string }>();
  const { setValues, values } = useFormikContext<CreateGeneralMealTypeBodyParams>();
  const { selectedMealType } = useSelector((state: RootState) => state.mealsReducer);
  const navigate = useNavigate();

  const handleSaveAndPublish = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await handleSubmit();
      setTimeout(() => {
        navigate('/dashboard/meal-types', { state: { refresh: true } });
      }, 100);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (id && selectedMealType) {
      const formattedStartTime = moment(selectedMealType.startTime, 'hh:mm A').format('HH:mm');
      const formattedEndTime = moment(selectedMealType.endTime, 'hh:mm A').format('HH:mm');
      setValues((prevValues: CreateGeneralMealTypeBodyParams) => ({
        ...prevValues,
        ...selectedMealType,
        startTime: formattedStartTime,
        endTime: formattedEndTime,    
      }));
    }
  }, [id, selectedMealType, setValues]);
  

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block">
          Name
        </label>
        <Field as="select" name="name" id="name" className="border w-full rounded p-2">
          <option value="">Select Meal Type</option>
          <option value="breakfast">Breakfast</option>
          <option value="morning_snack">Morning Snack</option>
          <option value="lunch">Lunch</option>
          <option value="afternoon_snack">Afternoon Snack</option>
          <option value="dinner">Dinner</option>
          <option value="snacks">Snacks</option>
        </Field>
        {errors.name && touched.name && (
          <div className="text-red-500 text-sm">{errors.name}</div>
        )}
      </div>
      <div>
        <label htmlFor="state" className="block">
          Status
        </label>
        <Field as="select" name="state" id="state" className="border w-full rounded p-2">
          <option value="">Select State</option>
          <option value="published">Active</option>
          <option value="unpublished">Inactive</option>
        </Field>
        {errors.state && touched.state && (
          <div className="text-red-500 text-sm">{errors.state}</div>
        )}
      </div>

      {/* Protein Percentage */}
      <div>
        <label htmlFor="proteinPercentage" className="block">
          Protein Percentage
        </label>
        <Field
          type="number"
          c name="proteinPercentage"
          id="proteinPercentage"
          className="border w-full rounded p-2"
        />
        {errors.proteinPercentage && touched.proteinPercentage && (
          <div className="text-red-500 text-sm">{errors.proteinPercentage}</div>
        )}
      </div>

      {/* Carbs Percentage */}
      <div>
        <label htmlFor="carbsPercentage" className="block">
          Carbs Percentage
        </label>
        <Field
          type="number"
          name="carbsPercentage"
          id="carbsPercentage"
          className="border w-full rounded p-2"
        />
        {errors.carbsPercentage && touched.carbsPercentage && (
          <div className="text-red-500 text-sm">{errors.carbsPercentage}</div>
        )}
      </div>

      {/* Fats Percentage */}
      <div>
        <label htmlFor="fatsPercentage" className="block">
          Fats Percentage
        </label>
        <Field
          type="number"
          name="fatsPercentage"
          id="fatsPercentage"
          className="border w-full rounded p-2"
        />
        {errors.fatsPercentage && touched.fatsPercentage && (
          <div className="text-red-500 text-sm">{errors.fatsPercentage}</div>
        )}
      </div>

      {/* Minimum Protein */}
      <div>
        <label htmlFor="minimumProtein" className="block">
          Minimum Protein
        </label>
        <Field
          type="number"
          name="minimumProtein"
          id="minimumProtein"
          className="border w-full rounded p-2"
        />
        {errors.minimumProtein && touched.minimumProtein && (
          <div className="text-red-500 text-sm">{errors.minimumProtein}</div>
        )}
      </div>

      {/* Start Time */}
      <div>
        <label htmlFor="startTime" className="block">
          Start Time
        </label>
        <Field
          type="time"
          name="startTime"
          id="startTime"
          value={values.startTime}
          // value={moment(values.startTime, 'hh:mm A').format('HH:mm')} // Display as 24-hour time for input
          className="border w-full rounded p-2"
        />
        {errors.startTime && touched.startTime && (
          <div className="text-red-500 text-sm">{errors.startTime}</div>
        )}
      </div>

      {/* End Time */}
      <div>
        <label htmlFor="endTime" className="block">
          End Time
        </label>
        <Field
          type="time"
          name="endTime"
          id="endTime"
          className="border w-full rounded p-2"
          value={values.endTime} 
          // value={moment(values.endTime, 'hh:mm A').format('HH:mm')} // Display as 24-hour time for input
        />
        {errors.endTime && touched.endTime && (
          <div className="text-red-500 text-sm">{errors.endTime}</div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex col-span-2 justify-end gap-4">
        {/* <button
          type="button"
          className="border-2 border-rose-600 text-gray-500 px-4 py-2 rounded-lg hover:text-white hover:bg-rose-600"
        >
          Save As Draft
        </button> */}
        <button
          onClick={handleSaveAndPublish}
          type="button"
          className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
        >
          Save & Publish
        </button>
      </div>
    </div>
  )
}

export default InputFields;
