import { FormikHelpers } from "formik";
import { loginApi, meApi, registerApi } from "../../apiServices/endpoints/authentication";
import { loginApiBodyParams, registerApiBodyParams } from "../../apiServices/endpoints/authentication/types";
import { NavigateFunction } from "react-router";
import { store } from "../store";
import { setUserData } from "./reducer";
import { homePathFor } from "../../utils/roles";

export const onLogin = async (props: loginApiBodyParams, { setSubmitting }: FormikHelpers<loginApiBodyParams>, navigate: NavigateFunction) => {
  try {
    setSubmitting(true);
    const response = await loginApi(props);
    if (response.data.login.success) {
      store.dispatch(setUserData(response.data.login))
      navigate(homePathFor(response.data.login.user?.role))
    }
  } catch {
    // Already reported by the request layer's error toast; callers don't
    // await this, so rethrowing would only surface as an unhandled rejection.
  } finally {
    setSubmitting(false);
  }
}

export const onRegister = async (props: registerApiBodyParams, { setSubmitting }: FormikHelpers<registerApiBodyParams & { confirmPassword: string }>, navigate: NavigateFunction) => {
  try {
    setSubmitting(true);
    const response = await registerApi(props);
    if (response.data.login.success) {
      store.dispatch(setUserData(response.data.login));
      navigate(homePathFor(response.data.login.user?.role));
    }
  } catch {
    // Reported by the request layer's error toast (e.g. email already in use,
    // or "Registration is disabled").
  } finally {
    setSubmitting(false);
  }
};

// Re-reads the signed-in user so their role is current (it may have changed
// since login, or be missing on a session saved before roles existed).
// Resolves to false if the profile couldn't be loaded.
export const onRefreshProfile = async (): Promise<boolean> => {
  try {
    const user = await meApi();
    const current = store.getState().userReducer.userData;
    store.dispatch(setUserData({ ...current, user: { ...current.user, ...user } }));
    return true;
  } catch {
    return false;
  }
};
