import { createAsyncThunk } from '@reduxjs/toolkit';
import { logout } from '../../../apis/auth/logout';
import { setToast } from '../../common/slices';

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue, dispatch }) => {
  try {
    await logout();

    dispatch(
      setToast({
        show: true,
        message: 'Logged out successfully',
        duration: 3000,
        type: 'success',
      })
    );

    return null;
  } catch (error: any) {
    const errorMessage = error?.message || 'Logout failed';

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
});
