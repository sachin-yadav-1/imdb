import { createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../../../apis/auth/login';
import { setToast } from '../../common/slices';

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await login(payload);

      dispatch(
        setToast({
          show: true,
          message: 'Login successful',
          duration: 3000,
          type: 'success',
        })
      );

      return data;
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed';

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
