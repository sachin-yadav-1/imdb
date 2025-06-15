import { createAsyncThunk } from '@reduxjs/toolkit';
import { signup } from '../../../apis/auth/signup';
import { setToast } from '../../common/slices';

export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (payload: SignupPayload, { rejectWithValue, dispatch }) => {
    try {
      const { data } = (await signup(payload)) as any;

      if (data.emailConfirmationRequired) {
        dispatch(
          setToast({
            show: true,
            message: 'Please check your email to confirm your account',
            duration: 5000,
            type: 'success',
          })
        );
      } else {
        dispatch(
          setToast({
            show: true,
            message: 'Account created successfully',
            duration: 3000,
            type: 'success',
          })
        );
      }

      return data;
    } catch (error: any) {
      const errorMessage = error?.message || 'Signup failed';

      dispatch(
        setToast({
          show: true,
          message: errorMessage,
          duration: 3000,
          type: 'error',
        })
      );

      return rejectWithValue(errorMessage);
    }
  }
);
