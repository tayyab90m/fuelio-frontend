import { FC } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { EditMealTypeProps } from '../../interfaces/meal/editType';
import { updateGeneralMealsApi } from '../../apiServices/endpoints/meal';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { onMountAllMealTypes, onUpdateMealType } from '../../redux/meals/action';
import { UpdateGeneralMealTypeBodyParams } from '../../apiServices/endpoints/meal/types';


const EditMealType: FC<EditMealTypeProps> = ({ setIsEdit }) => {
  const { selectedMealType } = useSelector((state: RootState) => state.mealsReducer)
  const initialValues: UpdateGeneralMealTypeBodyParams = selectedMealType || { id: '', name: '', carbsPercentage: 0, proteinPercentage: 0, startTime: '', state: '', fatsPercentage: 0, description: '', minimumProtein: 0, endTime: '' }
  const backToList = () => {
    setIsEdit(false);
    onMountAllMealTypes();
  }

  return (
    <div className=' h-full'>
      <div className='bg-white h-full'>
        <h2 className='flex gap-2 pl-1'>
          <ArrowLeft onClick={backToList} className='text-white cursor-pointer bg-rose-600 p-1 w-[30px] h-[30px] rounded' />
          <span className='text-2xl font-bold text-gray-900'>New Type</span>
        </h2>
        <Formik
          initialValues={initialValues}
          onSubmit={onUpdateMealType}
        >
          {({ errors, touched }) => {
            return (
              <Form className='p-10 max-w-3xl mx-auto'>
                <div className='flex items-center justify-center flex-col'>
                  <div className='form-group mb-9 w-full flex items-center gap-4'>
                    <label htmlFor="firstName">Name</label>
                    <Field className='border flex-1 w-full rounded p-2' id="name" name='name' placeholder="Meal type" />
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
                  <div className='form-group self-end flex gap-2'>
                    <button className='border-2 font-bold border-rose-600 transition text-gray-500 px-4 py-2 rounded-lg hover:text-white hover:bg-rose-600' type="submit">Submit</button>
                  </div>
                </div>
              </Form>
            )
          }}

        </Formik>
      </div>
    </div>
  );
}

export default EditMealType;
