import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { EyeIcon, EyeClosedIcon, Mail, Lock, Flame, User } from 'lucide-react';
import { registerSchema } from '../../../utils/validation/authentication';
import { onRegister } from '../../../redux/user/action';

const inputClass =
  'w-full pl-10 pr-4 py-2 mb-1 bg-stone-100 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400';

const FieldError = ({ message }: { message?: string }) => (
  <div className="h-[25px]">
    {message ? <div className="p-1 inline rounded bg-rose-400 text-white">{message}</div> : null}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-back flex items-center justify-center min-h-screen p-4 sm:p-8">
      <div className="flex flex-col md:flex-row max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden w-full">
        <div className="w-full md:w-1/2 px-6 sm:px-8 py-8 md:py-12">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-gray-800">Fuelio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center md:text-left mb-4 mt-6">
            Create your <span className="text-primary">Fuelio</span> account
          </h2>
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={registerSchema}
            onSubmit={({ name, email, password }, helpers) =>
              onRegister({ name: name.trim(), email, password }, helpers as never, navigate)
            }
          >
            {({ errors, touched, isSubmitting }) => (
              <Form noValidate>
                <div className="relative">
                  <label htmlFor="name" className="ml-1 text-gray-500">Name</label>
                  <Field id="name" className={inputClass} name="name" type="text" placeholder="Your name" autoComplete="name" />
                  <User className="absolute top-[47%] translate-y-[-50%] left-3 text-gray-400" />
                  <FieldError message={touched.name ? errors.name : undefined} />
                </div>

                <div className="relative">
                  <label htmlFor="email" className="ml-1 text-gray-500">Email</label>
                  <Field id="email" className={inputClass} name="email" type="email" placeholder="Email" autoComplete="email" />
                  <Mail className="absolute top-[47%] translate-y-[-50%] left-3 text-gray-400" />
                  <FieldError message={touched.email ? errors.email : undefined} />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="ml-1 block text-gray-500">Password</label>
                  <div className="relative w-full">
                    <Field
                      id="password"
                      className={inputClass}
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                    />
                    <Lock className="absolute top-[45%] translate-y-[-50%] left-3 text-gray-400" />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                    >
                      {showPassword ? <EyeClosedIcon size={20} /> : <EyeIcon size={20} />}
                    </button>
                  </div>
                  <FieldError message={touched.password ? errors.password : undefined} />
                </div>

                <div className="mb-6 relative">
                  <label htmlFor="confirmPassword" className="ml-1 block text-gray-500">Confirm password</label>
                  <Field
                    id="confirmPassword"
                    className={inputClass}
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat the password"
                    autoComplete="new-password"
                  />
                  <Lock className="absolute top-[45%] translate-y-[-50%] left-3 text-gray-400" />
                  <FieldError message={touched.confirmPassword ? errors.confirmPassword : undefined} />
                </div>

                <button
                  className="w-full font-bold px-4 py-2 text-white bg-primary rounded-lg hover:opacity-90 transition-all focus:outline-none focus:ring-1 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-60"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
                <p className="mt-4 text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-primary to-secondary p-8">
          <div className="text-center text-white">
            <Flame className="w-14 h-14 mx-auto mb-4 opacity-90" />
            <p className="text-2xl font-bold">Eat to your goals.</p>
            <p className="text-white/80 mt-2">Answer a few questions and get a weekly meal plan and shopping list.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
