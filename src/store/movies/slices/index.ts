import { createSlice } from '@reduxjs/toolkit';
import { moviesInitialState } from '../constants';

const moviesSlice = createSlice({
  name: 'movies',
  initialState: moviesInitialState,
  reducers: {
    clearErrors: (state) => {
      state.error = moviesInitialState.error;
    },
  },
});

export default moviesSlice.reducer;
