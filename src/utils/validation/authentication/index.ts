import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  password: Yup.string()
    .min(7, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string().trim().required('Required').max(100, 'Too Long!'),
  email: Yup.string().email('Invalid email').required('Required'),
  // Matches the backend rule (at least 8 characters).
  password: Yup.string().min(8, 'Use at least 8 characters').max(72, 'Too Long!').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Required'),
});
