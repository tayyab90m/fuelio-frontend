import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { EyeIcon, EyeClosedIcon, Mail, Lock } from 'lucide-react'; // Importing eye icons
import Logo from '../../../assets/images/logo.png';
import ImgBg from '../../../assets/images/bossbodies2.jpg';
import VideoPlayer from '../../../components/videoPlayer';
import { loginSchema } from '../../../utils/validation/authentication';
import { onLogin } from '../../../redux/user/action';

const Login = () => {
  const navigate = useNavigate();
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleUserInteraction = () => {
    setIsUserInteracted(true);
  };

  return (
    <div
      onClick={handleUserInteraction}
      className="login-back flex items-center justify-center min-h-screen p-4 sm:p-8"
    >
      <VideoPlayer
        isUserInteracted={isUserInteracted}
        onUserInteraction={handleUserInteraction}
      />
      <div className="flex flex-col md:flex-row max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden w-full">
        {/* Left Section */}
        <div className="w-full md:w-1/2 px-6 sm:px-8 py-8 md:py-12">
          <img src={Logo} className="w-10 mx-auto md:mx-0" alt="Logo" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center md:text-left mb-4 mt-6">
            Welcome to <span className="text-[#E1172C]">Boss Bodies</span>
          </h2>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={(value, func) => {
              onLogin(value, func, navigate);
            }}
            validationSchema={loginSchema}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                {/* Email Field */}
                <div className='relative'>
                  <label className="ml-1 text-gray-500">Email</label>
                  <Field
                    className="w-full pl-10 pr-4 py-2 mb-1 bg-stone-100 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400"
                    name="email"
                    type="email"
                    placeholder="Email"
                  />
                  <Mail className='absolute top-[47%] translate-y-[-50%] left-3 text-gray-400'/>
                  <div className="h-[25px]">
                    {errors.email && touched.email ? (
                      <div className="p-1 inline rounded bg-rose-400 text-white">
                        {errors.email}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div className="mb-8 relative">
                  <label className="ml-1 block text-gray-500">Password</label>
                  <div className="relative w-full">
                    <Field
                      className="w-full pl-10 pr-4 py-2 mb-1 bg-stone-100 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400"
                      name="password"
                      type={showPassword ? 'text' : 'password'} // Toggle password visibility
                      placeholder="Password"
                    />
                    <Lock className='absolute top-[45%] translate-y-[-50%] left-3 text-gray-400'/>
                    {/* Eye Icon for Show/Hide Password */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                    >
                      {showPassword ? <EyeClosedIcon size={20} /> : <EyeIcon size={20} />}
                    </button>
                  </div>
                  <div className="h-[25px]">
                    {errors.password && touched.password ? (
                      <div className="p-1 inline rounded bg-rose-400 text-white">
                        {errors.password}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  className="w-full font-bold px-4 py-2 text-white bg-[#E1172C] rounded-lg hover:bg-red-500 transition-all focus:outline-none focus:ring-1 focus:ring-red-400 focus:ring-offset-2"
                  type="submit"
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Right Section */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center">
          <img className="object-cover h-full w-full" src={ImgBg} alt="Background" />
        </div>
      </div>
    </div>
  );
};

export default Login;
