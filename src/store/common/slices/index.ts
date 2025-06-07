import { createSlice } from '@reduxjs/toolkit';
import { commonInitialState } from '../constants';

const commonSlice = createSlice({
  name: 'common',
  initialState: commonInitialState,
  reducers: {
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    resetToast: (state) => {
      state.toast = commonInitialState.toast;
    },
  },
});

export const { setToast, resetToast } = commonSlice.actions;
export default commonSlice.reducer;
