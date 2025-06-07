import { createSlice } from '@reduxjs/toolkit';
import { actorsInitialState } from '../constants';

const actorsSlice = createSlice({
  name: 'actors',
  initialState: actorsInitialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearErrors: (state) => {
      state.error = actorsInitialState.error;
    },
  },
});

export const { clearSearchResults, clearErrors } = actorsSlice.actions;
export default actorsSlice.reducer;
