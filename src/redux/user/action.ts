import { FormikHelpers } from "formik";
import { loginApi } from "../../apiServices/endpoints/authentication";
import { loginApiBodyParams } from "../../apiServices/endpoints/authentication/types";
import { NavigateFunction } from "react-router";
import { store } from "../store";
import { setUserData } from "./reducer";

export const onLogin = async (props: loginApiBodyParams, { setSubmitting }: FormikHelpers<loginApiBodyParams>, navigate: NavigateFunction) => {
  try {
    setSubmitting(true);
    const response = await loginApi(props);
    if (response.data.login.success) {
      store.dispatch(setUserData(response.data.login))
      navigate('/dashboard/coach-dashboard')
    }
  } finally {
    setSubmitting(false);
  }
}