import { createSlice } from '@reduxjs/toolkit';
import { producersInitialState } from '../constants';

const producersSlice = createSlice({
  name: 'producers',
  initialState: producersInitialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearErrors: (state) => {
      state.error = producersInitialState.error;
    },
  },
});

export const { clearSearchResults, clearErrors } = producersSlice.actions;
export default producersSlice.reducer;
