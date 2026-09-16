import { FC, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { onCreateMealType, onUpdateMealType } from '../../../../redux/meals/action';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { CreateGeneralMealTypeBodyParams } from '../../../../apiServices/endpoints/meal/types';
import InputFields from './fields'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import moment from 'moment';


const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
  // code: Yup.string().required('Code is required'),
  // description: Yup.string(),
  state: Yup.string().required('State is required'),
  proteinPercentage: Yup.number()
    .required('Protein percentage is required')
    .min(0, 'Must be at least 0')
    .max(100, 'Must be 100 or less'),
  carbsPercentage: Yup.number()
    .required('Carbs percentage is required')
    .min(0, 'Must be at least 0')
    .max(100, 'Must be 100 or less'),
  fatsPercentage: Yup.number()
    .required('Fats percentage is required')
    .min(0, 'Must be at least 0')
    .max(100, 'Must be 100 or less'),
  minimumProtein: Yup.number().required('Minimum protein is required').min(0, 'Must be at least 0'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
});
const NewType: FC<any> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedMealType } = useSelector((state: RootState) => state.mealsReducer);
  const [initialValues, setInitialValues] = useState<CreateGeneralMealTypeBodyParams>({
    name: '',
    description: '',
    state: '',
    proteinPercentage: 0,
    carbsPercentage: 0,
    fatsPercentage: 0,
    minimumProtein: 0,
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    if (id && selectedMealType) {
      const formattedStartTime = selectedMealType.startTime
      ? moment(selectedMealType.startTime).format('hh:mm A')
        : '';
      const formattedEndTime = selectedMealType.endTime
        ? moment(selectedMealType.endTime).format('hh:mm A')
        : '';
      setInitialValues({
        ...selectedMealType,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      });
    }
  }, [id, selectedMealType]);

  const handleSubmit = async (values: CreateGeneralMealTypeBodyParams, formikHelper: any) => {
    try {
      // Convert startTime and endTime from hh:mm AM/PM to HH:mm (24-hour format)
      const formattedStartTime = moment(values.startTime, 'hh:mm A').format('HH:mm');
      const formattedEndTime = moment(values.endTime, 'hh:mm A').format('HH:mm');
  
      const updatedValues = {
        ...values,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };
  
      if (id && id !== 'new') {
        await onUpdateMealType({ ...updatedValues, id }, formikHelper);
      } else {
        await onCreateMealType(updatedValues, formikHelper);
      }
  
      navigate('/dashboard/meal-types', { state: { refresh: true } });
    } catch (error) {
    }
  };
  
  
  return (
    <div className="p-6 h-full">
      <div className="bg-white p-5 h-full">
        <h2 className="flex gap-2">
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="text-white cursor-pointer bg-rose-600 p-1 w-[30px] h-[30px] rounded"
          />
          <span className="text-2xl font-bold text-gray-900">{id ? 'Edit' : 'New'} Type</span>
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(props) => {
            return (
              <Form className="p-10  mx-auto">
                <InputFields {...props} />
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  );
}

export default NewType;
